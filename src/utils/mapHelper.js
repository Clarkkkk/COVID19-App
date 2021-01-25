import '@/assets/china.js';
import fetchJSON from '@/utils/fetchJSON';
import {nameMap, provincePinyinMap} from '@/utils/mappings';
import * as echarts from 'echarts';



const DIMENSION_COLOR = ['#EF6C00', '#C62828', '#0277BD', '#283593'];

const helper = {
  createMap(elem, option) {
    // initialize echarts
    const map = echarts.init(elem);  
    // create a basic option object using the defaults defined above
    const basicOption = helper.createBasicOption(
      'title',
      'color',
      'toolbox',
      'tooltip',
      'legend',
      'visualMap'
    );

    // set zooming tool's callbacks
    const zoomProxy = helper.createZoomProxy(map);
    basicOption.toolbox.feature.myZoomIn.onclick = () => zoomProxy.level *= 2;
    basicOption.toolbox.feature.myZoomOut.onclick = () => zoomProxy.level /= 2;
    map.setOption(basicOption);

    // set option using user's option
    if (option) {
      map.setOption(option);
      console.log(option);
      console.log(map.getOption());
      helper.setPieces(map);
      helper.setMapLegendSymbol(map);
    }

    // when a different legend is selected
    // set the pieces and legend symbol accordingly
    map.on('legendselectchanged', function(params) {
      helper.setPieces(map);
      helper.setMapLegendSymbol(map);
      console.log('legendselectchanged');
      console.log(map.getOption());
    });

    // resize the map when window resizes
    let id = 0;
    window.addEventListener('resize', (event) => {
      if (id) {
        clearTimeout(id);
      }
      id = setTimeout(() => {
        map.resize();
        id = 0;
      }, 350);
    });
    console.log(map.getOption());
    return map;
  },
  // create a zoom proxy
  // when the zoom level changes, change other relavant options accordingly
  createZoomProxy(map) {
    return {
      value: 1,
      set level(newVal) {
        // set zoom level when the argument is in range 1-3
        if (newVal <= 9 && newVal >= 1) {
          helper.setZoomLevel(newVal, map);
          this.value = newVal;
        }
        // set the icon color to reflect if it is available
        // according to the zoom level
        helper.setIconColor('myZoomOut', this.value > 1, map);
        helper.setIconColor('myZoomIn', this.value < 9, map);
        // when zoom level is over 1, show the map label
        helper.setMapLabel(this.value > 1, map);
        helper.setMapLegendSymbol(map);
        console.log(map.getOption());
      },
      get level() {
        return this.value;
      },
    };
  },
  // set toolbox's icon color to indicate whether the feature is available
  setIconColor(toolName, available, map) {
    const color = available ? '#666' : '#aaa';
    map.setOption({
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
  },
  // set the map's zoom level
  setZoomLevel(level, map) {
    map.setOption({
      series: {
        zoom: level
      }
    });
  },
  // set the map labels to show or not
  setMapLabel(show, map) {
    console.log(map.getOption().series);
    const series = map.getOption().series;
    series.forEach((item) => {
      console.log(item);
      item.showLegendSymbol = false;
      item.label = {
        show: show,
        fontSize: 14,
        color: '#444',
        formatter: '{b}'
      };
    });
    map.setOption({series: series});
    console.log(map.getOption());
  },
  // find the selected legend and determine if its symbol need to display
  // is it useful?
  setMapLegendSymbol(map) {
    const series = map.getOption().series;
    const selected = this.getSelected(map);
    series.forEach((item) => {
      console.log(item);
      const labelShow = item.label.show;
      const name = item.name;
      item.showLegendSymbol = !labelShow && (name === selected.dimension);
    });
    map.setOption({series: series});
  },
  // find the currently selected legend
  // return dimension name and dimension index
  getSelected(map) {
    const mapOption = map.getOption();
    const selected = mapOption.legend[0].selected;
    const keys = Object.keys(selected);
    let dimension;
    for (const key of keys) {
      if (selected[key]) {
        dimension = key;
      }
    }
    const dimensions = mapOption.dataset[0].dimensions;
    const index = dimensions.indexOf(dimension);
    return {
      dimension: dimension,
      index: index
    };
  },
  // set pieces for visual map
  setPieces(map) {
    const mapOption = map.getOption();
    console.log(mapOption);
    const index = this.getSelected(map).index;
    const source = mapOption.dataset[0].source;
    // find the max number
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
    map.setOption({
      visualMap: {
        pieces: pieces,
        dimension: index,
        inRange: {
          color: DIMENSION_COLOR[index - 1],
          colorLightness: [1, 0.2]
        }
      }
    });
  },
  // import another map
  importMap(mapName) {
    // import('@/assets/world.js');
  },
  updateMap(option, provinceName, map) {
    // hide loading anyway at first
    map.hideLoading();
    // if update time exceeds 500ms, show loading animation
    let id = 0;
    id = setTimeout(() => {
      console.log('showloading');
      map.showLoading();
      id = 0;
    }, 500);

    let fetchMap;
    // no need to fetch china
    if (provinceName === 'china' || echarts.getMap(provinceName)) {
      fetchMap = Promise.resolve();
    } else {
      let mapFileName;
      if (provinceName === 'world') {
        mapFileName = 'world.json';
      } else {
        mapFileName = provincePinyinMap[provinceName] + '.json';
      }
      fetchMap = fetchJSON('', '/maps/' + mapFileName);
    }
    fetchMap.then((mapJson) => {
      echarts.registerMap(provinceName, mapJson);
      map.setOption(option);
      helper.setPieces(map);
      helper.setMapLegendSymbol(map);
      console.log(map.getOption());
      // hide loading or clear timer for loading
      if (id) {
        console.log('clear');
        clearTimeout(id);
        id = 0;
      } else {
        map.hideLoading();
      }
    });
  },
  // used to create a basic map option object
  // or one of the sub option object
  createBasicOption(...options) {
    const basciOption = {
      title: {
        subtext: '数据来自@BlankerL',
        sublink: 'https://github.com/BlankerL/DXY-COVID-19-Crawler',
        left: 10,
        top: 10,
        itemGap: 5
      },
      color: DIMENSION_COLOR,
      toolbox: {
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
          myZoomIn: {
            title: '放大',
            iconStyle: {
              color: '#666',
              borderWidth: 0.2
            },
            icon: 'M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
          },
          myZoomOut: {
            title: '缩小',
            iconStyle: {
              color: '#aaa',
              borderWidth: 0.2
            },
            icon: 'M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
          },
          saveAsImage: {
            pixelRatio: 2,
            iconStyle: {
              borderColor: '#666',
              borderWidth: 2
            }
          }
        }
      },
      tooltip: {
        trigger: 'item',
        show: true,
        extraCssText: 'align-items: flex-start',
        formatter: ({seriesName, dimensionNames, data, name}) => {
          if (data) {
            const province = data[0];
            const index = dimensionNames.indexOf(seriesName);
            const value = data[index];
            const updateTime = data[data.length - 1];
            const formatTime = (new Date(updateTime)).toLocaleString();
            return `${province} | ${seriesName}：${value} <br> ${formatTime}`;
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
      },
      visualMap: {
        type: 'piecewise',
        right: 10,
        bottom: 10
      },
      series: {
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
      }
    };
    let optionObj;
    if (options.length > 1) {
      optionObj = {};
      for (const option of options) {
        optionObj[option] = basciOption[option];
      }
    } else if (options.length === 1) {
      optionObj = basciOption[options[0]];
    }
    return optionObj;
  }
};

export default {
  createBasicOption: helper.createBasicOption,
  updateMap: helper.updateMap,
  createMap: helper.createMap
};
