import BasicChart from '@/utils/BasicChart.js';

export default class BarChart extends BasicChart {
  constructor(elem, option, dimensionNames, valueType) {
    super(elem, option);
    this.dimensionNames = dimensionNames;
    this.valueType = valueType;
    this._setOption(this._createBarBasicOption());
    this._setSeries(option.dataset);

    // when a different legend is selected,
    // reset all the series's datasetIndex
    // otherwise the order of the specific dataset won't come into effect
    this._chart.on('legendselectchanged', (params) => {
      this._setDatasetIndex();
    });
  }

  update(dataset) {
    this._setOption({dataset});
  }

  _setSeries(dataset) {
    // if series's length is zero
    // it means this is the initial setOption for series
    const isInitial = !this._getOption().series.length;
    const series = [];
    for (const dimensionName of this.dimensionNames) {
      const option = isInitial ? this._createSeriesBasicOption() : {};
      option.name = dimensionName;
      series.push(option);
    }
    console.log(series);
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

    const series = this.dimensionNames.map((dimensionName) => {
      return {
        name: dimensionName,
        datasetIndex
      };
    });
    console.log(this._getOption());
    this._setOption({
      series
    }, false);
    // update the order of axis's categories
    this._updateAxis();
  }

  _updateAxis() {
    const xAxis = this._getOption().xAxis;
    const yAxis = this._getOption().yAxis;
    this._setOption({xAxis, yAxis});
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

  _createBarBasicOption() {
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
        axisLabel: {
          formatter: (value, index) => this._valueFormatter(value)
        }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        axisLabel: {
          interval: 0
        }
      },
      dataZoom: {
        type: 'slider',
        orient: 'vertical',
        right: 20,
        zoomLock: true,
        brushSelect: false,
        startValue: 0,
        endValue: 12,
        rangeMode: ['value', 'value']
      },
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
        }
      },
    };
  }

  _createSeriesBasicOption() {
    return {
      type: 'bar',
      label: {
        show: true,
        position: 'right',
        formatter: (params) => {
          const index = params.dimensionNames.indexOf(params.seriesName);
          const value = params.value[index];
          return this._valueFormatter(value);
        }
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
