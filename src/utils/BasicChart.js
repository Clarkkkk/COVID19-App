import * as echarts from 'echarts';

const DIMENSION_COLOR = ['#EF6C00', '#C62828', '#0277BD', '#283593'];

export default class BasicChart {
  constructor(elem, option) {
    // BasicChart is used as a basic class for MapChart etc
    if (new.target === BasicChart) {
      throw new Error('BasicChart is used as a basic class');
    }

    // initialize echarts
    this._echarts = echarts;
    this._chart = this._echarts.init(elem);

    // create a basic option object
    const basicOption = this._createBasicOption();
    this._setOption(basicOption);

    // set option using user's option
    if (option) {
      this._setOption(option);
    }

    this._chart.on('legendselectchanged', () => this._setPieces());
  }

  // this._chart's methods
  _setOption(option, lazyUpdate = true) {
    this._chart.setOption(option, {lazyUpdate: lazyUpdate});
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

  _setPieces() {
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
        pieces: pieces,
        dimension: index,
        inRange: {
          color: DIMENSION_COLOR[index - 1],
          colorLightness: [1, 0.2]
        }
      }
    });
  }

  // find the currently selected legend
  // return dimension name and dimension index
  _getSelected() {
    const option = this._getOption();
    // An object like: {dimensionName: true/false}
    const selected = option.legend[0].selected;
    // find the dimensionName whose value is true
    const selectedDimension =
      Object.keys(selected).find((key) => selected[key]);
    // get its index in dataset's dimensions
    const seletedIndex =
      option.dataset[0].dimensions.indexOf(selectedDimension);
    return {
      dimension: selectedDimension,
      index: seletedIndex
    };
  }

  // create a basic chart option
  _createBasicOption() {
    const basicOption = {
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
      }
    };
    return basicOption;
  }
}
