import '@/assets/china.js';
import * as echarts from 'echarts';
const DIMENSION_COLOR = ['#EF6C00', '#C62828', '#0277BD', '#283593'];
export function defaultSeriousOption() {
  return {
    type: 'map',
    map: 'china',
    top: 30,
    bottom: 20,
    aspectScale: 0.77,
    seriousLayoutBy: 'column',
    showLegendSymbol: false,
    roam: 'move',
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

export function createMap(elem, option) {
  // initialize echarts
  const map = echarts.init(elem);
  // a reflect object, used to define some reactive properties
  // for example, when the zoomLevel change,
  // call setOption to change icon color etc
  const reflect = {
    // series zoomLevel reflection
    zoomLevelValue: 1,
    set zoomLevel(newVal) {
      // set zoom level when the argument is in range 1-3
      if (newVal <= 3 && newVal >= 1) {
        this.setZoomLevel(newVal);
        this.zoomLevelValue = newVal;
      }
      // set the icon color to reflect if it is available
      // according to the zoom level
      this.setIconColor('myZoomOut', this.zoomLevelValue > 1);
      this.setIconColor('myZoomIn', this.zoomLevelValue < 3);
      this.setMapLabel(this.zoomLevelValue > 1);
      this.setMapLegendSymbol();
      console.log(map.getOption());
    },
    get zoomLevel() {
      return this.zoomLevelValue;
    },
    setIconColor(toolName, available) {
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
    setZoomLevel(level) {
      map.setOption({
        series: {
          zoom: level
        }
      });
    },
    setMapLabel(show) {
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
    setMapLegendSymbol() {
      const mapOption = map.getOption();
      const series = map.getOption().series;
      const selected = this.getSelected(mapOption);
      series.forEach((item) => {
        console.log(item);
        const labelShow = item.label.show;
        const name = item.name;
        item.showLegendSymbol = !labelShow && (name === selected.dimension);
      });
      map.setOption({series: series});
    },

    // visualMap pieces reflection
    piecesValue: [],
    getSelected(mapOption) {
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
    setPieces(mapOption) {
      const index = this.getSelected(mapOption).index;
      const source = mapOption.dataset[0].source;
      let max = 0;
      source.forEach((arr) => {
        if (arr[index] > max) {
          max = arr[index];
        }
      });

      console.log(max);
      // normalize the number, for example, 356 to 300, 1234 to 1000
      const orderOfMagnitude = 10 ** Math.floor(Math.log10(max));
      max = max - (max % orderOfMagnitude);
      const pieces = [];
      if (orderOfMagnitude >= 10000) {
        for (let i = Math.min(8, Math.log10(orderOfMagnitude)); i > 0; i--) {
          pieces.push({min: 10 ** (i - 1), max: 10 ** i});
        }
        pieces.push({value: 0});
        pieces.unshift({min: 10 ** Math.min(8, Math.log10(orderOfMagnitude))});
      } else {
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
    }
  };

  map.on('legendselectchanged', function(params) {
    const mapOption = map.getOption();
    reflect.setPieces(mapOption);
    reflect.setMapLegendSymbol();
    console.log('legendselectchanged');
    console.log(map.getOption());
  });

  map.on('dblclick', () => {
    console.log(map.getOption());
  });

  // set option using the defaults above
  map.setOption({
    title: {
      text: '今日疫情地图',
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
          onclick: () => ++reflect.zoomLevel,
          iconStyle: {
            color: '#666',
            borderWidth: 0.2
          },
          icon: 'M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
        },
        myZoomOut: {
          title: '缩小',
          onclick: () => --reflect.zoomLevel,
          iconStyle: {
            color: '#aaa',
            borderWidth: 0.2
          },
          icon: 'M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z'
        },
        saveAsImage: {
          name: '今日疫情地图',
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
      formatter: ({seriesName, dimensionNames, data}) => {
        const province = data[0];
        const index = dimensionNames.indexOf(seriesName);
        const value = data[index];
        const updateTime = data[data.length - 1];
        const formatTime = (new Date(updateTime)).toLocaleString();
        return `${province} | ${seriesName}：${value} <br> ${formatTime}`;
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
    }
  });

  // set option using user's option
  if (option) {
    map.setOption(option);
    console.log(map.getOption());
    reflect.setPieces(map.getOption());
    reflect.setMapLegendSymbol();
  }

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
}
