
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

export default class BasicChart {
  constructor(elem, {dimensions, fullscreen, valueType, valueUnit, legendRange}) {
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
    this._chart = this._echarts.init(elem);
    this.dimensions = dimensions;
    this.valueType = valueType;
    this.valueUnit = valueUnit;
    this.legendRange = legendRange;
    // eslint-disable-next-line max-len
    this.DIMENSION_COLOR = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
    // ['#EF6C00', '#C62828', '#0277BD', '#283593'];
    this._fullscreen = fullscreen;


    // create a basic option object
    const basicOption = this._createBasicOption();
    this._setOption(basicOption);

    // resize the map when window resizes
    let id = 0;
    window.addEventListener('resize', (event) => {
      if (id) {
        clearTimeout(id);
      }
      id = setTimeout(() => {
        this._resize();
        id = 0;
      }, 350);
    });

    // for test
    this._chart.on('dblclick', () => console.log(this._getOption()));
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
    this._chart.hideLoading();
  }

  _showLoading() {
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
      emphasis: {
        iconStyle: {
          shadowBlur: 5,
          shadowColor: '#888',
          borderColor: '#666'
        }
      },
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          iconStyle: {
            borderColor: '#666',
            borderWidth: 2
          }
        },
        myFullScreen: {
          title: '全屏显示',
          iconStyle: {
            color: '#666',
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
    if (is) {
      this._chart.getDom().classList.add('full-screen');
    } else {
      this._chart.getDom().classList.remove('full-screen');
    }
  }

  // create a basic chart option
  _createBasicOption() {
    // title, color, tooltip, legend are required components
    const basicOption = {
      title: {
        left: 10,
        top: 10,
        itemGap: 5
      },
      color: this.DIMENSION_COLOR,
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
      },
      legend: {
        selectedMode: 'single',
        orient: 'vertical',
        left: 10,
        bottom: 10
      }
    };
    return basicOption;
  }
}
