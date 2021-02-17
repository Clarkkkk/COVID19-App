import BasicChart from '@/utils/BasicChart.js';
import '@/assets/china.js';
import fetchJSON from '@/utils/fetchJSON';
import {nameMap, provinceFileNameMap} from '@/utils/mappings';

export default class MapChart extends BasicChart {
  constructor(elem, option, {valueType, province}) {
    // initialize this._chart
    super(elem, option, {valueType});
    // initialize zoom level's value and dimensionNames
    this.zoomLevelValue = 1;
    // set zooming tool's callbacks and map legend symbol
    this._setZoomFeatures();
    // setSeries should be called before dimensions relavant functions
    this._setSeries(province);
    this._setMapLegendSymbol();
    this._setVisualMap();

    // when a different legend is selected
    // set the legend symbol accordingly
    this._chart.on('legendselectchanged', (params) => {
      this._setMapLegendSymbol();
      this._setVisualMap();
    });
    console.log(this._getOption());
  }

  // register a new map and update it with the option
  updateMap(option, province) {
    // hide loading anyway at first
    this._hideLoading();
    // if update time exceeds 500ms, show loading animation
    let id = 0;
    id = setTimeout(() => {
      console.log('showloading');
      this._showLoading();
      id = 0;
    }, 300);

    let fetchMap;
    // no need to fetch china map
    if (province === '中国' || this._getMap(province)) {
      fetchMap = Promise.resolve();
    } else {
      const mapFileName = provinceFileNameMap[province] + '.json';
      fetchMap = fetchJSON('', '/maps/' + mapFileName);
    }
    fetchMap.then((mapJson) => {
      if (mapJson) {
        this._registerMap(province, mapJson);
      }
      this._setSeries(province);
      this._setOption(option);
      this._setVisualMap();
      this._setMapLegendSymbol();
      this._resetSeriesCenter();
      this.zoomLevel = 1;
      console.log(this._getOption());
      // hide loading or clear timer for loading
      if (id) {
        console.log('clear');
        clearTimeout(id);
        id = 0;
      } else {
        this._hideLoading();
      }
    });
  }

  /*
   *  The functions below are auxilary functions
   *  and should not be used outside the class
   */

  // this._echarts's methods
  _getMap(provinceName) {
    return this._echarts.getMap(provinceName);
  }

  _registerMap(provinceName, mapJson) {
    this._echarts.registerMap(provinceName, mapJson);
  }
  // create a zoom proxy
  // when the zoom level changes, change other relavant options accordingly
  set zoomLevel(level) {
    // set zoom level when the argument is in range 1-3
    if (level <= 9 && level >= 1) {
      this._setZoomLevel(level);
      this.zoomLevelValue = level;
    }
    // set the icon color to reflect if it is available
    // according to the zoom level
    this._setIconColor('myZoomOut', this.zoomLevelValue > 1);
    this._setIconColor('myZoomIn', this.zoomLevelValue < 9);
    // when zoom level is over 1, show the map label
    this._setMapLabel(this.zoomLevelValue > 1);
    this._setMapLegendSymbol();
    console.log(this._getOption());
  }

  get zoomLevel() {
    return this.zoomLevelValue;
  }

  _setZoomFeatures() {
    this._setOption({
      toolbox: {
        feature: {
          myZoomIn: {
            title: '放大',
            iconStyle: {
              color: '#666',
              borderWidth: 0.2
            },
            onclick: () => this.zoomLevel *= 2,
            // eslint-disable-next-line max-len
            icon: 'M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
          },
          myZoomOut: {
            title: '缩小',
            iconStyle: {
              color: '#666',
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
    const color = available ? '#666' : '#aaa';
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
        color: '#444',
        formatter: '{b}'
      };
    });
    this._setOption({series: series});
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
    console.log(pieces);
    this._setOption({
      visualMap: {
        type: 'piecewise',
        right: 10,
        bottom: 10,
        pieces: pieces,
        dimension: index,
        inRange: {
          color: this.DIMENSION_COLOR[index - 1],
          colorLightness: [1, 0.2]
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
      nameMap: nameMap,
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
