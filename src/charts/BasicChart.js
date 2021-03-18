
import * as echarts from 'echarts/core';

// import charts
import {
  BarChart,
  LineChart,
  MapChart,
  ScatterChart,
  CustomChart
} from 'echarts/charts';

// import echarts components
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  GridComponent,
  DataZoomSliderComponent,
  LegendScrollComponent,
  LegendPlainComponent,
  VisualMapPiecewiseComponent,
  TimelineComponent,
  GeoComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';

// import renderer
import {CanvasRenderer} from 'echarts/renderers';

echarts.use(
  [
    BarChart,
    LineChart,
    MapChart,
    ScatterChart,
    CustomChart,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    AxisPointerComponent,
    GridComponent,
    DataZoomSliderComponent,
    LegendPlainComponent,
    LegendScrollComponent,
    VisualMapPiecewiseComponent,
    TimelineComponent,
    GeoComponent,
    DatasetComponent,
    TransformComponent,
    CanvasRenderer
  ]
);

import {
  ExecuteQueue,
  createDebounce,
  createThrottle
} from '../utils';

// those functions is shared in charts due to the same closure
const renderDebounce = createDebounce(1500);
const renderThrottle = createThrottle(1000);

class BasicChart {
  constructor(elem, basicConfig) {
    const {
      dimensions,
      fullscreen,
      valueType,
      valueUnit,
      legendRange,
      priority = 0
    } = basicConfig;

    // BasicChart is used as a basic class for MapChart etc
    if (new.target === BasicChart) {
      throw new Error('BasicChart is used as a basic class');
    }

    // Params "elem" and "dimensions" are required
    if (!elem || !dimensions) {
      // eslint-disable-next-line max-len
      throw new Error('Params "elem" and "dimensions" are required');
    }

    // initialize echarts
    this._echarts = echarts;
    // null is necessary
    this._chart = this._echarts.init(elem, null, {useDirtyRect: true});
    // eslint-disable-next-line max-len
    this.DIMENSION_COLOR = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
    this.dimensions = dimensions;
    this.valueType = valueType;
    this.valueUnit = valueUnit;
    this.legendRange = legendRange;

    // used in fullscreen switch
    this._fullscreen = fullscreen;

    // used in render queue
    this._renderCount = 0;
    this._priority = priority;

    // when the chart finish rendering, call next to render next chart
    this._chart.on('finished', () => {
      // debugger;
      this._renderCount--;
      // console.log('finished: ' + this.chartId);
      BasicChart.queue.next();
    });

    // some rendering won't fire 'finished' event
    // call next manually in rendered event to render the rest of queue
    this._chart.on('rendered', () => {
      if (this._renderCount) {
        if (this._loading) {
          // while showing loading, rendered event is fired constantly,
          // use throttle to call next
          renderThrottle(() => {
            // console.log('throttle: render next');
            this._renderCount = 0;
            BasicChart.queue.next();
          });
        } else {
          // debounce the call of next,
          // because there could be so many rendered event during rendering
          renderDebounce(() => {
            // console.log('debounce: render next');
            this._renderCount--;
            BasicChart.queue.next();
          });
        }
      }
      this._renderCount++;
    });

    // initialize the canvas first, so that showLoading is available
    this._setOption({title: {text: ''}});

    // resize the map when window resizes
    const resizeDebounce = createDebounce(200);
    window.addEventListener('resize', () => {
      resizeDebounce(() => this._resize());
    });

    // for test
    this._chart.on('dblclick', () => {
      console.log(this._getOption());
      console.log(this);
    });
  }

  // push the update function into the queue
  update(...args) {
    if (this._update) {
      BasicChart.queue.push(this._priority, async () => {
        await this._update(...args);
        this._hideLoading();
      });
    } else {
      throw new Error('"this._update" is not defined.');
    }
  }

  showLoading() {
    this._showLoading();
  }

  hideLoading() {
    this._chart.hideLoading();
  }

  // this._chart's methods
  _setOption(option, config) {
    config = config || {};
    if (config.lazyUpdate === undefined) {
      config.lazyUpdate = true;
    }
    this._chart.setOption(option, config);
  }

  _getOption() {
    return this._chart.getOption();
  }

  _hideLoading() {
    this._loading = false;
    this._chart.hideLoading();
  }

  _showLoading() {
    this._loading = true;
    this._chart.showLoading();
  }

  _resize() {
    this._chart.resize();
  }

  // find the currently selected legend
  // return dimension name and dimension index
  _getSelected() {
    const option = this._getOption();
    // An object like: {dimensionName: true/false}
    const selected = option.legend[0].selected;

    // _getSelected() must be called after the dataset series is set
    if (typeof selected !== 'object') {
      throw new Error('Selected is not an object.' +
        '_getSelected() must be called after the dataset and series are set');
    }

    // find the dimensionName whose value is true
    const selectedDimension =
      Object.keys(selected).find((key) => selected[key]);
    // get its index in dataset's dimensions
    const seletedIndex = this.dimensions.indexOf(selectedDimension);
    return {
      dimension: selectedDimension,
      index: seletedIndex
    };
  }

  _getLegendDimensions() {
    // if this.legendRange is not provided,
    // the dataset follow a convention that the first dimension is
    // area name, and the last is update time
    const range = this.legendRange || [1, this.dimensions.length - 1];
    return this.dimensions.slice(...range);
  }

  // format the value by the valueType
  // if valueType is an array,
  // it means values in different dimensions have different types
  _valueFormatter(value, dimensionIndex) {
    const type = Array.isArray(this.valueType) ?
      this.valueType[dimensionIndex] : this.valueType;
    if (type === 'percentage') {
      return (value * 100).toFixed(2) + '%';
    } else if (type === 'decimal') {
      if (value === Math.floor(value)) {
        return value;
      } else {
        return value.toFixed(2);
      }
    } else {
      const valueAbs = Math.abs(value);
      if (valueAbs < 10000) {
        return value;
      } else if (valueAbs >= 10000 && valueAbs < 100000000) {
        return (value / 10000).toFixed(1) + '万';
      } else {
        return (value / 100000000).toFixed(1) + '亿';
      }
    }
  }

  // set the default toolbox after user defiend toolbox is set
  // in order to place the default tools behind other tools
  _setBasicToolbox() {
    const toolbox = {
      itemSize: 20,
      itemGap: 20,
      top: 10,
      right: 15,
      iconStyle: {
        shadowBlur: 5,
        shadowColor: '#fff'
      },
      emphasis: {
        iconStyle: {
          shadowBlur: 5,
          shadowColor: '#888',
          borderColor: '#222'
        }
      },
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          iconStyle: {
            borderColor: '#222',
            borderWidth: 2
          }
        },
        myFullScreen: {
          title: '全屏显示',
          iconStyle: {
            color: '#222',
            borderWidth: 0.2
          },
          onclick: () => this.switchFullScreen(),
          // eslint-disable-next-line max-len
          icon: 'M20 3h2v6h-2V5h-4V3h4zM4 3h4v2H4v4H2V3h2zm16 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z'
        }
      }
    };
    this._setOption({toolbox});
  }

  switchFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    setTimeout(() => this._resize(), 1000);
  }

  get isFullScreen() {
    return this._fullscreen.value;
  }

  set isFullScreen(is) {
    this._fullscreen.value = is;
    // eslint-disable-next-line max-len
    const enterIcon = 'M20 3h2v6h-2V5h-4V3h4zM4 3h4v2H4v4H2V3h2zm16 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z';
    // eslint-disable-next-line max-len
    const exitIcon = 'M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z';
    this._setOption({
      toolbox: {
        feature: {
          myFullScreen: {
            title: is ? '退出全屏' : '全屏显示',
            icon: is ? exitIcon : enterIcon
          }
        }
      }
    });
  }

  _getLayoutConfig(userOption) {
    const config = {};
    if (userOption.dataZoom) {
      config.dataZoom = {};
      if (Array.isArray(userOption.dataZoom) && userOption.dataZoom.length === 2) {
        config.dataZoom.vertical = true;
        config.dataZoom.horizontal = true;
      } else {
        const orient =
          userOption.dataZoom.orient || userOption.dataZoom[0].orient;
        config.dataZoom.vertical = orient === 'vertical';
        config.dataZoom.horizontal = orient === 'horizontal';
      }
    }

    if (userOption.timeline) {
      config.timeline = true;
    }

    if (userOption.title.subtext !== undefined) {
      config.subtext = true;
    }

    if (userOption.visualMap) {
      config.visualMap = true;
    }

    return config;
  }

  // create a basic chart option
  _setBasicOption(layoutConfig) {
    // title, color, tooltip, legend are required components
    const basicOption = {
      title: {
        left: 15,
        top: 15,
        itemGap: 5
      },
      color: this.DIMENSION_COLOR,
      toolbox: {
        itemSize: 20,
        itemGap: 20,
        top: 10,
        right: 15,
      },
      legend: {
        type: 'scroll',
        selectedMode: 'single',
        orient: 'horizontal',
        left: 10,
        bottom: 10,
        textStyle: {
          color: '#000',
          textShadowColor: '#fff',
          textShadowBlur: 2,
        }
      },
      grid: {
        left: 40,
        right: 15,
        top: 50,
        bottom: 60
      },
      tooltip: {
        trigger: 'item',
        show: true,
        extraCssText: 'align-items: flex-start',
        formatter: (params) => {
          const {
            componentType,
            seriesName,
            dimensionNames,
            data,
            name
          } = params;

          if (data) {
            if (componentType === 'series') {
              const province = data[0];
              const index = dimensionNames.indexOf(seriesName);
              const value = this._valueFormatter(data[index], index);
              const updateTime = data[data.length - 1];
              const formatTime = (new Date(updateTime)).toLocaleString();
              return `${province} | ${seriesName}：${value} <br> ${formatTime}`;
            } else if (componentType === 'timeline') {
              return name;
            }
          } else {
            return `${name} | 暂无数据`;
          }
        }
      }
    };

    const {dataZoom, timeline, visualMap, subtext} = layoutConfig;
    if (subtext) {
      basicOption.grid.top += 20;
    }

    if (visualMap) {
      basicOption.visualMap = {
        type: 'piecewise',
        right: 10,
        bottom: timeline ? 100 : 50,
      };
    }

    if (dataZoom) {
      basicOption.dataZoom = [];
      if (dataZoom.vertical) {
        basicOption.grid.left += 20;
        basicOption.dataZoom.push({
          type: 'slider',
          orient: 'vertical',
          left: 10,
        });
      }

      if (dataZoom.horizontal) {
        basicOption.grid.bottom += 50;
        basicOption.dataZoom.push({
          type: 'slider',
          orient: 'horizontal',
          bottom: 60,
        });
      }
    }

    if (timeline) {
      basicOption.grid.bottom += 50;
      basicOption.legend.bottom += 50;
      basicOption.timeline = {
        left: 10,
        right: 0,
        bottom: 10,
        label: {
          formatter(value) {
            return value.match(/[0-9]{2}-[0-9]{2}$/);
          }
        }
      };
    }

    this._setOption(basicOption);
    return basicOption;
  }
}

BasicChart.queue = new ExecuteQueue();

export default BasicChart;
