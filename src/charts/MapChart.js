import BasicChart from './BasicChart';
import {fetchJSON} from '@/utils';
import {nameMap} from '@/utils';

export default class MapChart extends BasicChart {
  constructor(elem, option, config) {
    if (!config.area) {
      throw new Error('Area must be provided.');
    }

    super(elem, config);
    this._showLoading();
    // this.chartId = this._priority + '-map';
    BasicChart.queue.push(this._priority, async () => {
      await this._initialize(option, config);
      this._hideLoading();
    });
  }

  async _initialize(option, config) {
    await this._registerMap(config.area);
    const layoutConfig = this._getLayoutConfig(option);
    layoutConfig.visualMap = true;
    this._setBasicOption(layoutConfig);
    this._setOption(option);
    // initialize zoom level's value and dimensionNames
    this._zoomLevelValue = 1;
    // set zooming tool's callbacks and map legend symbol
    this._setZoomFeatures();
    this._roamLock = true;
    // setSeries should be called before dimensions relavant functions
    this._setSeries(config.area);
    this._setMapLegendSymbol();
    this._setVisualMap();
    this._setBasicToolbox();

    // To fire a finished event
    setTimeout(() => this.zoomLevel = 1.001, 0);

    // when a different legend is selected
    // set the legend symbol accordingly
    this._chart.on('legendselectchanged', (params) => {
      this._setMapLegendSymbol();
      this._setVisualMap();
    });
  }

  // register a new map and update it with the option
  async _update(option, area) {
    // To fire a finished event
    this.zoomLevel = 1.001;
    await this._registerMap(area);
    this._setSeries(area);
    this._setOption(option);
    this._setVisualMap();
    this._setMapLegendSymbol();
    this._resetSeriesCenter();
    this.zoomLevel = 1;
  }

  // this._echarts's methods
  _getMap(areaName) {
    return this._echarts.getMap(areaName);
  }

  async _registerMap(area) {
    // if the map is not registered, fetch it and register it
    if (!this._getMap(area)) {
      const mapJson = await fetchJSON('/maps/' + area + '.json');
      this._echarts.registerMap(area, mapJson);
    }
  }

  // create a zoom proxy
  // when the zoom level changes, change other relavant options accordingly
  // the zoom level could be 1.001, see _update() and _initialize()
  set zoomLevel(level) {
    // set zoom level when the argument is in range 1-9
    if (level <= 9 && level >= 1) {
      this._setZoomLevel(level);
      this._zoomLevelValue = level;
    }
    // set the icon color to reflect if it is available
    // according to the zoom level
    this._setIconColor('myZoomOut', this._zoomLevelValue >= 2);
    this._setIconColor('myZoomIn', this._zoomLevelValue < 9);
    // when zoom level is 2 and above, show the map label
    this._setMapLabel(this._zoomLevelValue >= 2);
    this._setMapLegendSymbol();
  }

  get zoomLevel() {
    return this._zoomLevelValue;
  }

  _switchDarkMode() {
    super._switchDarkMode();
    // set icon color for zoom in and zoom out
    this.zoomLevel = this.zoomLevel + 0;
    this._setIconColor('myRoamLock', true);
    this._setVisualMap();
  }

  _setZoomFeatures() {
    const {foregroundColor, unavailableColor} = this._getColors();
    this._setOption({
      toolbox: {
        feature: {
          myRoamLock: {
            title: '拖拽锁定切换',
            iconStyle: {
              color: foregroundColor,
              borderColor: foregroundColor,
              borderWidth: 0.2
            },
            onclick: () => this._switchRoamLock(),
            // eslint-disable-next-line max-len
            icon: 'm 21.122486,17.131627 h 1 v 5 h -8 v -5 h 1 v -1 c 0,-3.999998 6,-3.999998 6,0 z m -2,0 v -1 c 0,-1.333333 -2,-1.333333 -2,0 v 1 z m -7.012394,4.934428 -4.0000001,-4 4.6605501,-0.01101 v 3.357798 z m 0,-20 4,3.9999997 H 8.1100919 Z m 0,12 c -2.6666655,0 -2.6666655,-4 0,-4 2.666666,0 2.666666,4 0,4 z m -10.0000002,-2 4.0000001,-4.0000003 v 8.0000003 z m 19.5573792,-0.175744 -3.590689,0 0,-3.7365049 z'

          },
          myZoomIn: {
            title: '放大',
            iconStyle: {
              color: foregroundColor,
              borderColor: foregroundColor,
              borderWidth: 0.2
            },
            onclick: () => this.zoomLevel *= 2,
            // eslint-disable-next-line max-len
            icon: 'M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
          },
          myZoomOut: {
            title: '缩小',
            iconStyle: {
              color: unavailableColor,
              borderColor: unavailableColor,
              shadowColor: 'transparent',
              borderWidth: 0.2
            },
            onclick: () => this.zoomLevel /= 2,
            // eslint-disable-next-line max-len
            icon: 'M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
          }
        }
      }
    });
  }

  // set toolbox's icon color to indicate whether the feature is available
  _setIconColor(toolName, available) {
    const {
      foregroundColor,
      unavailableColor,
      backgroundColor
    } = this._getColors();
    const color = available ? foregroundColor : unavailableColor;
    const shadowColor = available ? backgroundColor : 'transparent';
    this._setOption({
      toolbox: {
        feature: {
          [toolName]: {
            iconStyle: {
              color: color,
              borderColor: color,
              shadowColor: shadowColor
            }
          }
        }
      }
    });
  }

  _setZoomLevel(level) {
    this._setOption({
      series: {
        zoom: level
      }
    }, {
      lazyUpdate: false
    });
  }

  _switchRoamLock() {
    this._roamLock = !this._roamLock;
    /* eslint-disable max-len */
    const roamIcon = 'M12 22l-4-4h8l-4 4zm0-20l4 4H8l4-4zm0 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM2 12l4-4v8l-4-4zm20 0l-4 4V8l4 4z';
    const roamLockIcon = 'm 21.122486,17.131627 h 1 v 5 h -8 v -5 h 1 v -1 c 0,-3.999998 6,-3.999998 6,0 z m -2,0 v -1 c 0,-1.333333 -2,-1.333333 -2,0 v 1 z m -7.012394,4.934428 -4.0000001,-4 4.6605501,-0.01101 v 3.357798 z m 0,-20 4,3.9999997 H 8.1100919 Z m 0,12 c -2.6666655,0 -2.6666655,-4 0,-4 2.666666,0 2.666666,4 0,4 z m -10.0000002,-2 4.0000001,-4.0000003 v 8.0000003 z m 19.5573792,-0.175744 -3.590689,0 0,-3.7365049 z';
    /* eslint-disable max-len */
    const icon = this._roamLock ? roamLockIcon : roamIcon;
    const roam = this._roamLock ? false : 'move';

    this._setOption({
      toolbox: {
        feature: {
          myRoamLock: {
            icon
          }
        }
      }
    });

    const series = [];
    const legendDimensions = this._getLegendDimensions();
    for (const dimension of legendDimensions) {
      const option = {
        name: dimension,
        roam
      };
      series.push(option);
    }
    this._setOption({series});
  }

  // set the map labels to show or not
  _setMapLabel(show) {
    const series = this._getOption().series;
    series.forEach((item) => {
      item.showLegendSymbol = false;
      item.label = {
        show: show,
        fontSize: 14,
        color: '#000',
        textShadowColor: '#fff',
        textShadowBlur: 2,
        formatter: '{b}'
      };
    });
    this._setOption({series});
  }

  // find the selected legend and determine if its symbol need to display
  // if there is label, hide the legend symbol
  // is it useful?
  _setMapLegendSymbol() {
    const series = this._getOption().series;
    const selected = this._getSelected();
    series.forEach((item) => {
      const labelShow = item.label.show;
      const name = item.name;
      item.showLegendSymbol = !labelShow && (name === selected.dimension);
    });
    this._setOption({series: series});
  }

  // reset the center to null for every series
  _resetSeriesCenter() {
    const series = this._getOption().series;
    series.forEach((item) => item.center = null);
    this._setOption({series: series});
  }

  // set pieces for visualMap
  _setVisualMap() {
    const {colorSet, shadowColor, foregroundColor} = this._getColors();
    const option = this._getOption();
    const index = this._getSelected().index;
    const source = option.dataset[0].source;
    // find the max number in the data of selected dimension
    let max = 0;
    source.forEach((arr) => {
      if (arr[index] > max) {
        max = arr[index];
      }
    });
    // normalize the number, for example, 356 to 300, 1234 to 1000
    const orderOfMagnitude = 10 ** Math.floor(Math.log10(max));
    max = orderOfMagnitude ? max - (max % orderOfMagnitude) : 0;
    const pieces = [];
    // increase fast, 1, 10, 100, 1000, etc
    if (orderOfMagnitude >= 10000) {
      for (let i = Math.min(8, Math.log10(orderOfMagnitude)); i > 0; i--) {
        pieces.push({min: 10 ** (i - 1), max: 10 ** i});
      }
      pieces.push({value: 0});
      pieces.unshift({min: 10 ** Math.min(8, Math.log10(orderOfMagnitude))});
    } else {
      // increase slower, 10, 20, 30, 40, etc
      const piece = max / 5;
      for (let i = 5; i > 1; i--) {
        pieces.push({min: piece * (i - 1), max: piece * i});
      }
      if (piece > 1) {
        pieces.push({min: 1, max: piece});
      }
      pieces.push({value: 0});
      pieces.unshift({min: piece * 5});
    }
    this._setOption({
      visualMap: {
        type: 'piecewise',
        pieces: pieces,
        dimension: index,
        inRange: {
          color: ['white', colorSet[index - 1]],
          colorLightness: [this._isDark ? 0.6 : 0.99, 0.2],
          colorSaturation: [0.6, 1]
        },
        textStyle: {
          color: foregroundColor,
          textShadowColor: shadowColor,
          textShadowBlur: 2,
        }
      }
    });
  }

  _setSeries(mapName) {
    // if series's length is zero
    // it means this is the initial setOption for series
    const isInitial = !this._getOption().series.length;
    const series = [];
    const legendDimensions = this._getLegendDimensions();
    for (const dimension of legendDimensions) {
      const option = isInitial ? this._createSeriesBasicOption() : {};
      option.map = mapName;
      option.name = dimension;
      series.push(option);
    }
    this._setOption({series: series});
  }

  _createSeriesBasicOption() {
    return {
      type: 'map',
      top: 35,
      bottom: 10,
      aspectScale: 0.77,
      seriousLayoutBy: 'column',
      showLegendSymbol: false,
      roam: !this._roamLock,
      nameMap,
      zoom: 1,
      label: {
        show: false,
        fontSize: 14,
        color: '#444',
        formatter: '{b}'
      },
      itemStyle: {
        borderColor: '#aaa'
      },
      emphasis: {
        label: {
          textShadowColor: '#888',
          textShadowBlur: 2
        },
        itemStyle: {
          shadowColor: '#aaa',
          shadowBlur: 10
        }
      }
    };
  }
}
