
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
    this._chart = this._echarts.init(elem, {useDirtyRect: true});
    this.dimensions = dimensions;
    this.valueType = valueType;
    this.valueUnit = valueUnit;
    this.legendRange = legendRange;
    // used in fullscreen switch
    this._fullscreen = fullscreen;
    this._isNarrow = window.screen.width <= 1024;
    this._active = true;

    this._initializeTimelineTooltip();
    this._priority = priority;
    this._initializeRenderStrategy();
    this._initializeColorMode();

    // initialize an empty canvas, so that showLoading is available
    this._setOption({title: {text: ''}});

    // resize the map when window resizes
    const resizeDebounce = createDebounce(200);
    window.addEventListener('resize', () => {
      this._active && resizeDebounce(() => this._resize());
    });

    // for test
    this._chart.on('dblclick', () => {
      console.log(this._getOption());
      console.log(this);
    });
  }


  /* Initialization */
  _initializeColorMode() {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    this._isDark = mediaQueryList.matches;
    mediaQueryList.addEventListener('change', (e) => {
      this._isDark = e.matches;
      this._switchDarkMode();
    });
  }

  _initializeTimelineTooltip() {
    this._chart.on('timelineplaychanged', (e) => {
      // set triggerOn to 'none' while playing
      // to prevent tooltipView._keepShow() from showing the wrong tip
      // (https://github.com/apache/echarts/blob/master/src/component/tooltip/TooltipView.ts)
      let triggerOn;
      if (e.playState) {
        triggerOn = 'none';
      } else {
        triggerOn = 'mousemove|click';
      }
      // timeline.tooltip is not configurable
      // set the global tooltip instead
      this._setOption({
        tooltip: {
          triggerOn
        }
      });
    });

    // when timeline changed, show the relative tooltip for it
    this._chart.on('timelinechanged', (e) => {
      // calculate all the config used in timelinechanged
      const timelineOption = this._getOption().timeline[0];
      const startLeft = 30;
      const endLeft = this._chart.getWidth() - 130;
      const dates = timelineOption.data;
      const top = this._chart.getHeight() - timelineOption.bottom - 120;
      const step = (endLeft - startLeft) / timelineOption.data.length;

      const index = e.currentIndex;

      // use the second 'if' of manuallyShowTip()
      // (https://github.com/apache/echarts/blob/master/src/component/tooltip/TooltipView.ts)
      this._chart.dispatchAction({
        type: 'showTip',
        x: startLeft + step * index,
        y: top,
        tooltip: {
          content: '',
          formatterParams: {
            componentType: 'timeline',
            name: dates[index],
            $vars: ['name']
          }
        }
      });
    });
  }

  _initializeRenderStrategy() {
    // used in render queue
    this._renderCount = 0;

    // when the chart finish rendering, call next to render next chart
    this._chart.on('finished', () => {
      this._renderCount--;
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
  }
  /* Initialization */


  /* Public methods */
  // push the update function into the queue
  update(...args) {
    if (!this._update) {
      throw new Error('"this._update" is not defined.');
    }

    BasicChart.queue.push(this._priority, async () => {
      await this._update(...args);
      this._hideLoading();
    });
  }

  showLoading() {
    this._showLoading();
  }

  activated() {
    this._active = true;
    this._resize();
  }

  deactivated() {
    this._active = false;
  }
  /* Public methods */


  /* Echarts instance method */
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
    const {foregroundColor, backgroundColor} = this._getColors();
    this._chart.showLoading({
      text: '加载中',
      fontSize: 14,
      textColor: foregroundColor,
      maskColor: backgroundColor + 'd0'
    });
  }

  _resize() {
    this._chart.resize();
  }
  /* Echarts instance method */


  /* Color mode methods */
  _getColors() {
    // basic colors
    /* eslint-disable max-len */
    const DIMENSION_COLOR = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
    const BACKGROUND_COLOR = '#ffffff';
    const FOREGROUND_COLOR = '#333333';
    const UNAVAILABLE_COLOR = '#aaaaaa';
    const APP_COLOR = '#00a59d';
    const APP_COLOR_LIGHTER = '#00a59d';
    const APP_COLOR_DARKER = '#00666d';
    const UNDERLINE_COLOR = APP_COLOR_LIGHTER;
    // dark colors
    // eslint-disable-next-line max-len
    const DIMENSION_COLOR_DARK = ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'];
    const BACKGROUND_COLOR_DARK = '#181818';
    const FOREGROUND_COLOR_DARK = '#ffffff';
    const UNAVAILABLE_COLOR_DARK = '#555555';
    const UNDERLINE_COLOR_DARK = APP_COLOR;
    return {
      colorSet: this._isDark ? DIMENSION_COLOR_DARK : DIMENSION_COLOR,
      foregroundColor: this._isDark ? FOREGROUND_COLOR_DARK : FOREGROUND_COLOR,
      backgroundColor: this._isDark ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR,
      shadowColor: this._isDark ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR,
      unavailableColor: this._isDark ? UNAVAILABLE_COLOR_DARK : UNAVAILABLE_COLOR,
      underlineColor: this._isDark ? UNDERLINE_COLOR_DARK : UNDERLINE_COLOR
    };
    /* eslint-disable max-len */
  }

  _switchDarkMode() {
    const {
      colorSet,
      foregroundColor,
      backgroundColor,
      shadowColor,
      underlineColor
    } = this._getColors();

    this._setOption({
      backgroundColor,
      color: colorSet,
      title: {
        backgroundColor,
        textStyle: {
          rich: {
            underline: {
              color: foregroundColor,
              backgroundColor,
              shadowColor: underlineColor
            }
          }
        },
      },
      legend: {
        textStyle: {
          color: foregroundColor,
          textShadowColor: shadowColor
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {
            iconStyle: {
              borderColor: foregroundColor,
              shadowColor: shadowColor
            }
          },
          myFullScreen: {
            iconStyle: {
              color: foregroundColor,
              borderColor: foregroundColor,
              shadowColor: shadowColor
            }
          }
        }
      }
    });
  }
  /* Color mode methods */


  /* Fullsreen methods */
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
  /* Fullsreen methods */


  /* Tool methods */
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
    const {shadowColor, foregroundColor} = this._getColors();
    const toolbox = {
      iconStyle: {
        shadowBlur: 5,
        shadowColor: shadowColor
      },
      emphasis: {
        iconStyle: {
          shadowBlur: 5,
          shadowColor: '#888',
          borderColor: foregroundColor
        }
      },
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          iconStyle: {
            borderColor: foregroundColor,
            borderWidth: 2
          }
        },
        myFullScreen: {
          title: '全屏显示',
          iconStyle: {
            color: foregroundColor,
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

  _getLayoutConfig(userOption) {
    const config = {};
    if (userOption.dataZoom) {
      config.dataZoom = {};
      // eslint-disable-next-line max-len
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
    const {
      shadowColor,
      backgroundColor,
      foregroundColor,
      colorSet,
      underlineColor
    } = this._getColors();
    const padding = this._isNarrow ? 0 : 15;
    // title, color, tooltip, legend are required components
    const basicOption = {
      title: {
        left: 15 + padding,
        top: 20 + padding,
        itemGap: 5,
        textStyle: {
          fontSize: 21,
          rich: {
            underline: {
              fontSize: 20,
              align: 'center',
              color: foregroundColor,
              fontWeight: 'bolder',
              padding: -5,
              backgroundColor,
              shadowColor: underlineColor,
              shadowOffsetY: 5
            }
          }
        }
      },
      color: colorSet,
      backgroundColor,
      toolbox: {
        itemSize: 20,
        itemGap: 20,
        top: 10 + padding,
        right: 15 + padding,
      },
      legend: {
        type: 'scroll',
        selectedMode: 'single',
        orient: 'horizontal',
        left: 10 + padding,
        bottom: 10 + padding,
        textStyle: {
          color: foregroundColor,
          textShadowColor: shadowColor,
          textShadowBlur: 2,
          textAlign: 'left'
        },
        tooltip: {
          show: true,
          formatter: (params) => {
            const name = params.name;
            /* eslint-disable max-len */
            switch (name) {
              case '现存确诊':
                return '<b>现存确诊</b> = 累计确诊 - 治愈 - 死亡<br><small>由于各个地区统计口径不一，<br>该数据未必能准确表示现存的确诊人数</small>';
              case '治愈':
                return '<small>各个地区统计口径不一<br>或不算入自愈人群，或仅记<br>录住院治疗后痊愈的人数</small>';
              case '死亡':
                return '<small>各个地区统计口径不一<br>或仅记录住院治疗后死亡的人数</small>';
              case '估计治疗率':
                return '<b>估计治疗率</b> =（治愈 + 死亡）/ 累计确诊<br><small>由于各个地区统计口径不一，<br>该数据未必有意义</small>';
              case '住院死亡率':
                return '<b>住院死亡率</b> = 死亡 /（治愈 + 死亡）<br><small>由于各个地区统计口径不一，<br>该数据未必有意义</small>';
              case '累计死亡率':
                return '<b>累计死亡率</b> = 死亡 / 累计确诊';
              case '感染密度':
                return '每百万人中的确诊人数';
              case '死亡密度':
                return '每百万人中的因新冠肺炎而死亡的人数';
              default:
                return name;
            }
            /* eslint-disable max-len */
          }
        }
      },
      grid: {
        left: 40 + padding * 3,
        right: 15 + padding * 3,
        top: 50 + padding * 3,
        bottom: 60 + padding * 3
      },
      tooltip: {
        trigger: 'item',
        show: true,
        hideDelay: 800,
        className: 'tooltip',
        extraCssText: `
          border: none;
          background-color: #ffffffb0;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          text-align: left;
          max-width: ${this._isNarrow ? 300 : 500}px;
          white-space: nowrap;
        `,
        position: (point, params, dom, rect, size) => {
          const [contentWidth, contentHeight] = size.contentSize;
          const [viewWidth, viewHeight] = size.viewSize;
          const [pointerX, pointerY] = point;
          const pos = {};
          if (pointerY + contentHeight + 15 > viewHeight) {
            pos.top = pointerY - contentHeight - 15;
          } else {
            pos.top = pointerY + 15;
          }

          if (pointerX + contentWidth > viewWidth) {
            pos.left = viewWidth - contentWidth;
          } else {
            pos.left = pointerX;
          }

          return pos;
        },
        formatter: (params) => {
          const {
            componentType,
            seriesName,
            dimensionNames,
            data,
            name
          } = params;

          if (data && componentType === 'series') {
            const province = data[0];
            const index = dimensionNames.indexOf(seriesName);
            const value = this._valueFormatter(data[index], index);
            const updateTime = data[data.length - 1];
            const formatTime = (new Date(updateTime)).toLocaleString();
            return `${province} | ${seriesName}：${value} <br> ${formatTime}`;
          } else if (componentType === 'timeline') {
            return name;
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
        right: 10 + padding,
        bottom: (timeline ? 100 : 50) + padding,
      };
    }

    if (dataZoom) {
      basicOption.dataZoom = [];
      if (dataZoom.vertical) {
        basicOption.grid.left += 20;
        basicOption.dataZoom.push({
          type: 'slider',
          orient: 'vertical',
          left: 10 + padding * 2,
        });
      }

      if (dataZoom.horizontal) {
        basicOption.grid.bottom += 50;
        basicOption.dataZoom.push({
          type: 'slider',
          orient: 'horizontal',
          bottom: 60 + padding * 2,
        });
      }
    }

    if (timeline) {
      basicOption.grid.bottom += 50;
      basicOption.legend.bottom += 50;
      basicOption.timeline = {
        left: 10,
        right: 0,
        bottom: 10 + padding,
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
  /* Tool methods */
}

BasicChart.queue = new ExecuteQueue();

export default BasicChart;
