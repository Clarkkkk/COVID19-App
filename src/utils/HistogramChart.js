import BasicChart from '@/utils/BasicChart.js';
import * as ecStat from 'echarts-stat';

export default class HistogramChart extends BasicChart {
  constructor(elem, option, basicConfig) {
    super(elem, basicConfig);
    this._echarts.registerTransform(ecStat.transform.histogram);
    option.dataset = this._transformDataset(option.dataset);
    this._setOption(option);
    this._setOption(this._createHistogramBasicOption(option));
    this._setSeries();
    console.log(this._getOption());

    // when a different legend is selected,
    // reset all the series's datasetIndex
    // otherwise the order of the specific dataset won't come into effect
    // when using different transform for different dimensions
    this._chart.on('legendselectchanged', (params) => {
      //this._setDatasetIndex();
    });
  }

  update(option) {
    this._setOption(option);
  }

  _transformDataset(dataset) {
    const transforms = this._getLegendDimensions().map((dimension) => {
      return {
        id: dimension,
        transform: {
          type: 'ecStat:histogram',
          print: true,
          config: {
            dimensions: dimension,
            method: 'freedmanDiaconis'
          }
        }
      };
    });
    const transform = [{
      transform: {
        type: 'ecStat:histogram',
        print: true,
        config: {
          dimensions: 0,
          method: 'freedmanDiaconis'
        }
      }
    }, {
      transform: {
        type: 'ecStat:histogram',
        print: false,
        config: {
          dimensions: 1,
          method: 'freedmanDiaconis'
        }
      }
    }];
    return Array.isArray(dataset) ?
      [...dataset, ...transforms] :
      [dataset, ...transforms];
  }

  _setSeries() {
    const dataset = this._getOption().dataset;
    const series = [];
    for (const dimension of this._getLegendDimensions()) {
      const option = this._createSeriesBasicOption();
      option.name = dimension;
      option.datasetIndex =
        dataset.findIndex((value) => value.id === dimension);
      series.push(option);
    }
    this._setOption({series});
  }

  _setDatasetIndex() {
    const dataset = this._getOption().dataset;
    const selectedDimension = this._getSelected().dimension;
    console.log(selectedDimension);
    let datasetIndex = 0;
    if (Array.isArray(dataset)) {
      const datasetIds = dataset.map((entry) => entry.id);
      console.log(datasetIds);
      console.log(selectedDimension);
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

  _createHistogramBasicOption(userOption) {
    return {
      legend: userOption.legend || {
        orient: 'horizontal',
        selectedMode: 'single',
        right: 'center',
        top: 20
      },
      grid: userOption.grid || [{
        left: 110,
        right: 120,
        top: 80,
        bottom: 50
      }],
      xAxis: userOption.xAxis || {
        name: '单位：人/每百万人',
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value) => this._valueFormatter(value)
        }
      },
      yAxis: userOption.yAxis || {
        type: 'value',
        axisLabel: {
          interval: 0
        }
      },
      dataZoom: {}
    };
  }

  _createSeriesBasicOption() {
    return {
      type: 'bar',
      barWidth: '100%',
      barCategoryGap: '0%',
      barGap: '0%',
      label: {
        show: true,
        position: 'top'
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
