import BasicChart from '@/utils/BasicChart.js';
import fetchJSON from '@/utils/fetchJSON';
import {nameMap} from '@/utils/mappings';

export default class MapChart extends BasicChart {
  constructor(elem, option, config) {
    if (!config.area) {
      throw new Error('Area must be provided.');
    }

    super(elem, config);
    //this.chartId = this._priority + 'map' + Date.now();
    BasicChart.queue.push(this._priority, async () => {
      await this._initialize(option, config);
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
    // setSeries should be called before dimensions relavant functions
    this._setSeries(config.area);
    this._setMapLegendSymbol();
    this._setVisualMap();
    this._setBasicToolbox();
    setTimeout(() => this.zoomLevel = 1.01, 0);

    // when a different legend is selected
    // set the legend symbol accordingly
    this._chart.on('legendselectchanged', (params) => {
      this._setMapLegendSymbol();
      this._setVisualMap();
    });
  }

  // register a new map and update it with the option
  async _update(option, area) {
    this.zoomLevel = 1.01;
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
  set zoomLevel(level) {
    // set zoom level when the argument is in range 1-3
    if (level <= 9 && level >= 1) {
      this._setZoomLevel(level);
      this._zoomLevelValue = level;
    }
    // set the icon color to reflect if it is available
    // according to the zoom level
    this._setIconColor('myZoomOut', this._zoomLevelValue > 1);
    this._setIconColor('myZoomIn', this._zoomLevelValue < 9);
    // when zoom level is over 1, show the map label
    this._setMapLabel(this._zoomLevelValue >= 2);
    this._setMapLegendSymbol();
  }

  get zoomLevel() {
    return this._zoomLevelValue;
  }

  _setZoomFeatures() {
    this._setOption({
      toolbox: {
        feature: {
          myZoomIn: {
            title: '放大',
            iconStyle: {
              color: '#222',
              borderWidth: 0.2
            },
            onclick: () => this.zoomLevel *= 2,
            // eslint-disable-next-line max-len
            icon: 'M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
          },
          myZoomOut: {
            title: '缩小',
            iconStyle: {
              color: '#aaa',
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
    const color = available ? '#222' : '#aaa';
    this._setOption({
      toolbox: {
        feature: {
          [toolName]: {
            iconStyle: {
              color: color
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
    max = max - (max % orderOfMagnitude);
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
          color: this.DIMENSION_COLOR[index - 1],
          colorLightness: [0.95, 0.2]
        },
        textStyle: {
          color: '#000',
          textShadowColor: '#fff',
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
      roam: 'move',
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
