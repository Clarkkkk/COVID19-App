
import * as echarts from 'echarts/core';

// import charts
import {
  BarChart,
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
    VisualMapPiecewiseComponent,
    TimelineComponent,
    GeoComponent,
    DatasetComponent,
    TransformComponent,
    CanvasRenderer
  ]
);

export default class BasicChart {
  constructor(elem, {dimensions, valueType, legendRange}) {
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
    this.legendRange = legendRange;
    // eslint-disable-next-line max-len
    this.DIMENSION_COLOR = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
    // ['#EF6C00', '#C62828', '#0277BD', '#283593'];


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
      return value.toFixed(2);
    } else {
      return value;
    }
  }

  // create a basic chart option
  _createBasicOption() {
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
