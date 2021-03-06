import BasicChart from './BasicChart';

export default class ScatterChart extends BasicChart {
  constructor(elem, option, basicConfig) {
    super(elem, basicConfig);
    // this.chartId = this._priority + '-scatter';
    this._showLoading();
    BasicChart.queue.push(this._priority, () => {
      this._initialize(option);
      this._hideLoading();
    });
  }

  _initialize(option) {
    this._setOption(option);

    const layoutConfig = this._getLayoutConfig(option);
    layoutConfig.dataZoom = {
      vertical: true,
      horizontal: true
    };
    this._setBasicOption(layoutConfig);
    this._setOption(this._createScatterBasicOption(option));
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
    const legendDimensions = this._getLegendDimensions();
    for (const dimension of legendDimensions) {
      const option = isInitial ? this._createSeriesBasicOption() : {};
      option.name = dimension;
      option.encode = {
        x: this.dimensions.indexOf(legendDimensions[0]) - 1,
        y: this.dimensions.indexOf(dimension)
      },
      series.push(option);
    }
    this._setOption({series});
  }

  _createScatterBasicOption(userOption) {
    return {
      xAxis: userOption.xAxis || {
        type: 'value',
        scale: true,
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: (value, index) => this._valueFormatter(value)
        }
      },
      yAxis: userOption.yAxis || {
        type: 'value',
        scale: true,
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: (value, index) => this._valueFormatter(value)
        }
      },
      dataZoom: [{
        type: 'slider',
        orient: 'vertical'
      }, {
        type: 'slider',
        orient: 'horizontal'
      }],
      tooltip: userOption.tooltip || {
        formatter: ({seriesName, dimensionNames, data, name}) => {
          if (data) {
            const area = data[0];
            const xValue = this._valueFormatter(data[1]);
            const xName = dimensionNames[1];
            const index = dimensionNames.indexOf(seriesName);
            const yValue = this._valueFormatter(data[index]);
            return `<b>${area}</b><br>${xName}：${xValue}<br>${seriesName}：${yValue}`;
          } else {
            return `${name} | 暂无数据`;
          }
        },
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1
          }
        }
      },
    };
  }

  _createSeriesBasicOption() {
    return {
      type: 'scatter',
      label: {
        show: false,
        position: 'right',
        formatter: (params) => {
          const index = params.dimensionNames.indexOf(params.seriesName);
          const value = params.value[index];
          return this._valueFormatter(value);
        }
      },
      datasetIndex: 1,
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
