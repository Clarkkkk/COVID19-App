import BasicChart from './BasicChart';

export default class LineChart extends BasicChart {
  constructor(elem, option, basicConfig) {
    super(elem, basicConfig);
    //this.chartId = this._priority + 'line' + Date.now();
    BasicChart.queue.push(this._priority, () => {
      this._initialize(option);
    });
  }

  _initialize(option) {
    const layoutConfig = this._getLayoutConfig(option);
    layoutConfig.dataZoom = {
      horizontal: true
    };
    this._setBasicOption(layoutConfig);
    this._setOption(option);
    this._setOption(this._createLineBasicOption(option));
    this._setBasicToolbox();
    this._setSeries();
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
  }

  _createLineBasicOption(userOption) {
    return {
      xAxis: userOption.xAxis || {
        type: 'category',
      },
      yAxis: userOption.yAxis || {
        type: 'value',
        axisLabel: {
          formatter: (value) => this._valueFormatter(value)
        }
      },
      dataZoom: userOption.dataZoom || {
        type: 'slider',
        orient: 'horizontal',
        zoomLock: false,
        brushSelect: false,
        startValue: 0,
        endValue: 12,
        rangeMode: ['value', 'value']
      },
      tooltip: {
        trigger: 'item',
        show: true,
        extraCssText: 'align-items: flex-start',
        formatter: (params) => {
          const {
            seriesName,
            dimensionNames,
            data,
          } = params;

          const date = data[0];
          const index = dimensionNames.indexOf(seriesName);
          const value = this._valueFormatter(data[index], index);
          if (data) {
            return `${date} | ${seriesName}：${value}`;
          } else {
            return `${date} | 暂无数据`;
          }
        }
      }
    };
  }

  _createSeriesBasicOption() {
    return {
      type: 'line',
      smooth: true,
      //sampling: 'lttb',
      //showSymbol: false,
      //showAllSymbol: true,
      label: {
        show: false,
        position: 'right',
        formatter: (params) => {
          const index = params.dimensionNames.indexOf(params.seriesName);
          const value = params.value[index];
          return params.value[0] + ': ' + this._valueFormatter(value, index);
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
