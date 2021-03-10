import BasicChart from '@/utils/BasicChart.js';

export default class CustomChart extends BasicChart {
  constructor(elem, option, config) {
    super(elem, config);
    const layoutConfig = this._getLayoutConfig(option);
    this._setBasicOption(layoutConfig);
    this._setOption(option);
    if (!config.chartTypes) {
      throw new Error('Chart types must be provided');
    }
    this.chartTypes = config.chartTypes;
    this.options = this._createOptions();
    this.frameCount = [];
    this._setOption(this.options[0]);
    this._setBasicToolbox();
    this._chart.on('legendselectchanged', () => {
      console.log('legend changed');
      this.isLegendChanged = true;
      this._setDatasetIndex();
    });
  }

  update(option) {
    this._setOption(option);
  }

  switchType(type) {
    for (const option of this.options) {
      if (option.type === type) {
        this._setOption(option, {
          lazyUpdate: false,
        });
        break;
      }
    }
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

  _createOptions() {
    const options = [];
    for (const type of this.chartTypes) {
      if (type.name === 'bar') {
        options.push(this._createBarOption(type.config));
      } else if (type.name === 'pie') {
        options.push(this._createPieOption());
      }
    }
    return options;
  }

  _createBarOption({isVertical, isInverse}) {
    const option = {
      type: 'bar',
      xAxis: {
        show: true,
        type: isVertical ? 'category' : 'value',
        inverse: isVertical && isInverse
      },
      yAxis: {
        show: false,
        type: isVertical ? 'value' : 'category',
        inverse: !isVertical && isInverse
      },
      dataZoom: {
        show: true,
        orient: isVertical ? 'horizontal' : 'vertical',
        startValue: 0,
      },
      animationDuration: 1000
    };

    this._setBasicOption({
      dataZoom: {
        horizontal: isVertical,
        vertical: !isVertical
      }
    });

    option.series = [];
    // dimensions excluding area name and update time
    const legendDimensions = this._getLegendDimensions();

    this._chart.on('finished', () => {
      for (let i = 0; i < this.frameCount.length; i++) {
        this.frameCount[i] = 0;
      }
    });

    for (const dimension of legendDimensions) {
      const dataset = this._getOption().dataset;
      let datasetIndex = 0;
      if (Array.isArray(dataset)) {
        const datasetIds = dataset.map((entry) => entry.id);
        if (datasetIds.includes(dimension)) {
          datasetIndex = datasetIds.indexOf(dimension);
        } else {
          datasetIndex = dataset.length - 1;
        }
      }

      const seriesEntry = {
        type: 'custom',
        name: dimension,
        datasetIndex,
        animationDurationUpdate: 1000,
      };

      const dimensionIndex = this.dimensions.indexOf(dimension);
      seriesEntry.encode = isVertical ?
        {x: 0, y: dimensionIndex} :
        {x: dimensionIndex, y: 0};

      seriesEntry.renderItem = (params, api) => {
        const xValue = api.value(seriesEntry.encode.x);
        const yValue = api.value(seriesEntry.encode.y);
        // inspired by echart source code
        const ordinalYValue = api.ordinalRawValue(seriesEntry.encode.y);
        const [xCoord, yCoord] = api.coord([xValue, yValue]);
        const xAxisLength = params.coordSys.width;
        const yAxisLength = params.coordSys.height;
        const gridX = params.coordSys.x;
        const gridY = params.coordSys.y;
        const dataCount = params.dataInsideLength;
        // the width of bars is twice as the gap width
        const gapWidth =
          (isVertical ? xAxisLength : yAxisLength) / dataCount / 3;

        this.frameCount[params.dataIndex] = 0;
        return {
          type: 'rect',
          morph: true,
          shape: (isVertical ? {
            x: xCoord - gapWidth,
            y: yCoord,
            width: gapWidth * 2,
            height: yAxisLength + gridY - yCoord
          } : {
            x: gridX,
            y: yCoord - gapWidth,
            width: xCoord - gridX,
            height: gapWidth * 2
          }),
          textContent: {
            style: {
              text: ordinalYValue
            }
          },
          textConfig: {
            // label position, x and y
            position: 'insideRight'
          },
          // animation for initial render, having 30 frames
          // not working for legend changing, need to be fixed
          during: (duringAPI) => {
            const size =
              isVertical ? yAxisLength + gridY - yCoord : xCoord - gridX;
            const frameCount = this.frameCount[params.dataIndex];
            if (frameCount < 1 && !this.isLegendChanged) {
              this.frameCount[params.dataIndex] += 1 / 30;
              if (isVertical) {
                duringAPI.setShape('x', isVertical ? xCoord - gapWidth : gridX);
                // eslint-disable-next-line max-len
                duringAPI.setShape('y', isVertical ? yCoord : yCoord - gapWidth);
                // eslint-disable-next-line max-len
                duringAPI.setShape('height', ((frameCount - 1) ** 3 + 1) * size);
                duringAPI.setShape('width', gapWidth * 2);
              } else {
                duringAPI.setShape('x', isVertical ? xCoord - gapWidth : gridX);
                // eslint-disable-next-line max-len
                duringAPI.setShape('y', isVertical ? yCoord : yCoord - gapWidth);
                // eslint-disable-next-line max-len
                duringAPI.setShape('height', isVertical ? yAxisLength + gridY - yCoord : gapWidth * 2);
                duringAPI.setShape('width', ((frameCount - 1) ** 3 + 1) * size);
              }
            }
            // console.log(duringAPI.getShape('width'));
            // console.log(++count);
          },
          style: api.style(),
          // focus is specified outside of emphasis
          // which is different from normal series
          focus: 'self',
          emphasis: api.styleEmphasis()
        };
      };

      option.series.push(seriesEntry);
    }
    return option;
  }

  _createPieOption() {
    const option = {
      type: 'pie',
      animationDuration: 1000,
      xAxis: {
        show: false
      },
      yAxis: {
        show: false,
      },
      dataZoom: {
        show: false
      }
    };

    option.series = [];
    // dimensions excluding area name and update time
    const legendDimensions = this._getLegendDimensions();
    const data = this._getOption().dataset[0].source;

    /*
    this._chart.on('finished', () => {
      for (let i = 0; i < this.frameCount.length; i++) {
        this.frameCount[i] = 0;
      }
    });
*/
    for (const dimension of legendDimensions) {
      const dimensionIndex = this.dimensions.indexOf(dimension);
      const dataset = this._getOption().dataset;
      let datasetIndex = 0;
      if (Array.isArray(dataset)) {
        const datasetIds = dataset.map((entry) => entry.id);
        if (datasetIds.includes(dimension)) {
          datasetIndex = datasetIds.indexOf(dimension);
        } else {
          datasetIndex = dataset.length - 1;
        }
      }
      const seriesEntry = {
        type: 'custom',
        name: dimension,
        datasetIndex,
        animationDurationUpdate: 1000
      };

      const dataSum = data
        .map((arr) => arr[dimensionIndex])
        .reduce((prev, curr) => prev + curr, 0);

      seriesEntry.renderItem = (params, api) => {
        if (!params.context.currentAngle) {
          params.context.currentAngle = -Math.PI / 2;
          console.log(params.context.currentAngle);
        }
        const value = api.value(dimensionIndex);
        const angle = value / dataSum * Math.PI * 2;
        params.context.currentAngle += angle;
        console.log(api.style());
        console.log(angle);
        const ordinalYValue = api.ordinalRawValue(0);
        const width = this._chart.getWidth();
        const height = this._chart.getHeight();
        return {
          type: 'sector',
          morph: true,
          shape: {
            cx: width / 2,
            cy: height / 2,
            r: Math.min(width, height) / 3,
            startAngle: params.context.currentAngle - angle,
            endAngle: params.context.currentAngle,
            clockwise: true,
            // inspired by echart source code
            cornerRadius: 5
          },
          textContent: {
            style: {
              text: ordinalYValue
            }
          },
          textConfig: {
            // label position, x and y
            position: 'inside'
          },
          style: {
            fill: this._getSectorColor(params.dataIndex)
          },
        };
      };
      option.series.push(seriesEntry);
    }

    return option;
  }

  _getSectorColor(index) {
    return this.DIMENSION_COLOR[index % 9];
  }
}
