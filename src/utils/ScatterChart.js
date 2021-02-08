import BasicChart from '@/utils/BasicChart.js';

export default class ScatterChart extends BasicChart {
  constructor(elem, option, {valueType}) {
    super(elem, option, {valueType});
    this._setOption(this._createScatterBasicOption());
    this._setSeries();
  }

  update(dataset) {
    this._setOption({dataset});
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
      series.push(option);
    }
    console.log(series);
    this._setOption({series});
  }

  _createScatterBasicOption() {
    return {
      legend: {
        orient: 'horizontal',
        selectedMode: 'single',
        right: 'center',
        top: 20
      },
      grid: [{
        left: 110,
        right: 120,
        top: 80,
        bottom: 50
      }],
      xAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: (value, index) => this._valueFormatter(value)
        }
      },
      yAxis: {
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
        orient: 'vertical',
        left: 20,
      }, {
        type: 'slider',
        orient: 'horizontal',
        bottom: 20,
      }],
      tooltip: {
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
          console.log(params);
          const index = params.dimensionNames.indexOf(params.seriesName);
          const value = params.value[index];
          return this._valueFormatter(value);
        }
      },
      encode: {
        x: 1,
        y: 2
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
