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
          config: {
            dimensions: dimension,
            method: 'freedmanDiaconis'
          }
        }
      };
    });
    return Array.isArray(dataset) ?
      [...dataset, ...transforms] :
      [dataset, ...transforms];
  }

  _setSeries() {
    const dataset = this._getOption().dataset;
    const histogramSeries = [];
    for (const dimension of this._getLegendDimensions()) {
      const option = this._createSeriesBasicOption();
      option.name = dimension;
      option.datasetIndex =
        dataset.findIndex((value) => value.id === dimension);
      histogramSeries.push(option);
    }
    const auxilarySeries = this._createAuxilarySeries();
    this._setOption({
      series: [
        ...histogramSeries,
        ...auxilarySeries
      ]
    });
  }

  _createHistogramBasicOption(userOption) {
    return {
      legend: userOption.legend || {
        orient: 'horizontal',
        selectedMode: 'single',
        right: 20,
        top: 50
      },
      grid: userOption.grid || [{
        left: 50,
        right: 30,
        top: 80,
        bottom: 50
      }],
      xAxis: userOption.xAxis || {
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
      dataZoom: {
        type: 'slider',
        brushSelect: false
      },
      tooltip: {
        trigger: 'item',
        show: true,
        extraCssText: 'align-items: flex-start',
        formatter: (params) => {
          const {
            seriesType,
            seriesName,
            dimensionNames,
            data
          } = params;

          if (data) {
            if (seriesType === 'bar') {
              const categoryIndex = dimensionNames.indexOf('DisplayableName');
              const category = data[categoryIndex];
              const valueIndex = dimensionNames.indexOf('VCount');
              const value = data[valueIndex];
              const dimensionIndex = this.dimensions.indexOf(seriesName);
              const unit = this.valueUnit[dimensionIndex];
              return `<b>${category}${unit}</b><br>${value} `;
            } else {
              const category = data[0];
              const valueIndex = dimensionNames.indexOf(seriesName);
              const value = this._valueFormatter(data[valueIndex]);
              const dimensionIndex = this.dimensions.indexOf(seriesName);
              const unit = this.valueUnit[dimensionIndex];
              return `<b>${category}</b><br>${value}${unit}`;
            }
          } else {
            return `暂无数据`;
          }
        }
      },
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

  _createAuxilarySeries() {
    const dataset = this._getOption().dataset[0];
    const legendDimensions = this._getLegendDimensions();

    const customDimensions = ['类型', ...legendDimensions];
    const meanArr = ['平均数'];
    const middleArr = ['中位数'];

    for (const dimension of legendDimensions) {
      const index = this.dimensions.indexOf(dimension);
      const dimensionData = dataset.source
        .map((item) => item[index])
        .sort((a, b) => a - b);
      meanArr.push(this._calcMean(dimensionData));
      middleArr.push(this._calcMiddle(dimensionData));
    }

    const series = [];
    const customData = [middleArr, meanArr];
    for (const dimension of legendDimensions) {
      series.push({
        type: 'custom',
        name: dimension,
        dimensions: customDimensions,
        data: customData,
        encode: {
          x: customDimensions.indexOf(dimension)
        },
        z: 3,
        renderItem(params, api) {
          const dataIndex = params.dataIndex;
          const xValue = api.value(customDimensions.indexOf(dimension));
          const [xCoord] = api.coord([xValue, xValue]);
          // const xAxisLength = params.coordSys.width;
          const yAxisLength = params.coordSys.height;
          // const gridX = params.coordSys.x;
          const gridY = params.coordSys.y;
          // const dataCount = params.dataInsideLength;
          const barWidth = 2;
          const colors = ['#fac858', '#ee6666'];
          const labelHeight = (dataIndex + 1) * 6 + '%';
          return {
            type: 'rect',
            shape: {
              x: xCoord - barWidth / 2,
              y: gridY,
              width: barWidth,
              height: yAxisLength
            },
            textContent: {
              style: {
                text: customData[dataIndex][0] + ': ' + xValue.toFixed(2)
              }
            },
            textConfig: {
              // label position
              position: [-15, labelHeight]
            },
            style: {
              fill: colors[dataIndex],
              opacity: 0.8
            },
          };
        }
      });
    }
    console.log(series);
    return series;
  }

  _calcMean(arr) {
    const sum = arr.reduce((prev, curr) => prev + curr, 0);
    return sum / arr.length;
  }

  _calcMiddle(arr) {
    const index = arr.length % 2 ?
      Math.floor(arr.length / 2) :
      (arr[arr.length / 2] + arr[arr.length / 2 + 1]) / 2;
    return arr[index];
  }
}
