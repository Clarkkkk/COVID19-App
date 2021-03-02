import * as echarts from 'echarts';

export default class BasicChart {
  constructor(elem, option, {valueType}) {
    // BasicChart is used as a basic class for MapChart etc
    if (new.target === BasicChart) {
      throw new Error('BasicChart is used as a basic class');
    }

    // Params "elem" and "option" are required
    if (!elem || !option) {
      // eslint-disable-next-line max-len
      throw new Error('Params "elem" and "option" are required.');
    }

    // initialize echarts
    this._echarts = echarts;
    this._chart = this._echarts.init(elem);
    this.valueType = valueType;
    // eslint-disable-next-line max-len
    this.DIMENSION_COLOR = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
    // ['#EF6C00', '#C62828', '#0277BD', '#283593'];


    // create a basic option object
    const basicOption = this._createBasicOption();
    this._setOption(basicOption);

    // set option using user's option
    if (option) {
      this._setOption(option);
    }

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
    if (!config) {
      config = {};
    }
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
  // must be called after the series is set
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

  _getLegendDimensions() {
    // the dataset follow a convention that the first dimension is
    // area name, and the last is update time
    const dimensions = this._getOption().dataset[0].dimensions;
    return dimensions.slice(1, dimensions.length - 1);
  }

  _valueFormatter(value) {
    if (this.valueType === 'percentage') {
      return (value * 100).toFixed(2) + '%';
    } else if (this.valueType === 'decimal') {
      return value.toFixed(2);
    } else {
      return value;
    }
  }

  // create a basic chart option
  _createBasicOption(...components) {
    // title, color, toolbox, tooltip, legend are required components
    const basicOption = {
      title: {
        subtext: '数据来自@BlankerL',
        sublink: 'https://github.com/BlankerL/DXY-COVID-19-Crawler',
        left: 10,
        top: 10,
        itemGap: 5
      },
      color: this.DIMENSION_COLOR,
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
            const value = this._valueFormatter(data[index]);
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
      }
    };
    return basicOption;
  }
}
