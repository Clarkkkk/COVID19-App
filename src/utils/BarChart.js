import BasicChart from '@/utils/BasicChart.js';

export default class BarChart extends BasicChart {
  constructor(elem, option, basicConfig) {
    super(elem, basicConfig);
    BasicChart.queue.push(this._priority, () => {
      this._initialize(option);
    });
  }

  _initialize(option) {
    const layoutConfig = this._getLayoutConfig(option);
    layoutConfig.dataZoom = {
      vertical: true
    };
    this._setBasicOption(layoutConfig);
    this._setOption(option);
    this._setOption(this._createBarBasicOption(option));
    this._setBasicToolbox();
    this._setSeries();

    // when a different legend is selected,
    // reset all the series's datasetIndex
    // otherwise the order of the specific dataset won't come into effect
    // when using different transform for different dimensions
    this._chart.on('legendselectchanged', (params) => {
      this._setDatasetIndex();
    });
  }

  _update(option) {
    this._setOption(option);
  }

  _setSeries() {
    // if series's length is zero
    // it means this is the initial setOption for series
    const isInitial = !this._getOption().series.length;
    const series = [];
    for (const dimension of this._getLegendDimensions()) {
      const option = isInitial ? this._createSeriesBasicOption() : {};
      option.name = dimension;
      series.push(option);
    }
    this._setOption({series});
    this._setDatasetIndex();
  }

  // set dataset index
  // if there is only one dataset, use it
  // if there are more than one datasets,
  // use one whose id matches the dimensionName,
  // otherwise use the last one of them
  // shoule be called after this._setSeries()
  _setDatasetIndex() {
    const dataset = this._getOption().dataset;
    const selectedDimension = this._getSelected().dimension;
    let datasetIndex = 0;
    if (Array.isArray(dataset)) {
      const datasetIds = dataset.map((entry) => entry.id);
      if (datasetIds.includes(selectedDimension)) {
        datasetIndex = datasetIds.indexOf(selectedDimension);
      } else {
        datasetIndex = dataset.length - 1;
      }
    }

    const series = this._getLegendDimensions().map((dimension) => {
      return {
        name: dimension,
        datasetIndex
      };
    });
    this._setOption({series}, {lazyUpdate: false});
    // update the order of axis's categories
    this._updateAxis();
  }

  // set the axis with the same option to reflect the order change
  // otherwise the order of axis's categories won't change
  _updateAxis() {
    const xAxis = this._getOption().xAxis;
    const yAxis = this._getOption().yAxis;
    this._setOption({xAxis, yAxis});
  }

  _createBarBasicOption(userOption) {
    return {
      xAxis: userOption.xAxis || {
        type: 'value',
        axisLabel: {
          formatter: (value) => this._valueFormatter(value)
        }
      },
      yAxis: userOption.yAxis || {
        type: 'category',
        inverse: true,
        axisLabel: {
          show: false
        }
      },
      dataZoom: userOption.dataZoom || {
        type: 'slider',
        orient: 'vertical',
        zoomLock: true,
        brushSelect: false,
        startValue: 0,
        endValue: 12,
        maxValueSpan: 13,
        rangeMode: ['value', 'value']
      }
    };
  }

  _createSeriesBasicOption() {
    return {
      type: 'bar',
      label: {
        show: true,
        position: 'insideRight',
        formatter: (params) => {
          const index = params.dimensionNames.indexOf(params.seriesName);
          const value = params.value[index];
          return params.value[0]; // + ': ' + this._valueFormatter(value, index);
        }
      },
      emphasis: {
        focus: 'self',
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
