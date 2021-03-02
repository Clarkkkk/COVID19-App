import BasicChart from '@/utils/BasicChart.js';

export default class CustomChart extends BasicChart {
  constructor(elem, option, {valueType, chartTypes}) {
    super(elem, option, {valueType});
    this.chartTypes = chartTypes;
    this.options = this._createOptions();
    this.frameCount = [];
    this._setOption(this.options[0]);
    this._chart.on('legendselectchanged', () => {
      console.log('legend changed');
      this.isLegendChanged = true;
      this._setOption({});
    });
  }

  update(dataset) {
    this._setOption({dataset});
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
        id: 'xAxis',
        show: true,
        type: isVertical ? 'category' : 'value',
        inverse: isVertical && isInverse
      },
      yAxis: {
        id: 'yAxis',
        show: true,
        type: isVertical ? 'value' : 'category',
        inverse: !isVertical && isInverse
      },
      dataZoom: {
        id: 'dataZoom',
        show: true,
        orient: isVertical ? 'horizontal' : 'vertical',
        startValue: 0,
      },
      animationDuration: 1000,
      legend: {
        selectedMode: 'single',
        orient: 'vertical',
        left: 10,
        bottom: 10
      },
      grid: [{
        left: 110,
        right: 120,
        top: 80,
        bottom: 50
      }],
    };

    option.series = [];
    // dimensions excluding area name and update time
    const legendDimensions = this._getLegendDimensions();
    // all dimensions
    const dimensions = this._getOption().dataset[0].dimensions;

    this._chart.on('finished', () => {
      for (let i = 0; i < this.frameCount.length; i++) {
        this.frameCount[i] = 0;
      }
    });

    for (const dimension of legendDimensions) {
      const dimensionIndex = dimensions.indexOf(dimension);
      const seriesEntry = {
        type: 'custom',
        name: dimension,
        animationDurationUpdate: 1000
      };

      seriesEntry.encode = isVertical ?
        {x: 0, y: dimensionIndex} :
        {x: dimensionIndex, y: 0};

      seriesEntry.renderItem = (params, api) => {
        const xValue = api.value(seriesEntry.encode.x);
        const yValue = api.value(seriesEntry.encode.y);
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
                duringAPI.setShape('y', isVertical ? yCoord : yCoord - gapWidth);
                duringAPI.setShape('height', ((frameCount - 1) ** 3 + 1) * size);
                duringAPI.setShape('width', gapWidth * 2);
              } else {
                duringAPI.setShape('x', isVertical ? xCoord - gapWidth : gridX);
                duringAPI.setShape('y', isVertical ? yCoord : yCoord - gapWidth);
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
        id: 'xAxis',
        show: false
      },
      yAxis: {
        id: 'yAxis',
        show: false,
      },
      dataZoom: {
        id: 'dataZoom',
        show: true,
        orient: 'horizontal',
        startValue: 0,
      },
      legend: {
        selectedMode: 'single',
        orient: 'vertical',
        left: 10,
        bottom: 10
      },
      grid: [{
        left: 110,
        right: 120,
        top: 80,
        bottom: 50
      }],
    };

    option.series = [];
    // dimensions excluding area name and update time
    const legendDimensions = this._getLegendDimensions();
    // all dimensions
    const dimensions = this._getOption().dataset[0].dimensions;
    const data = this._getOption().dataset[0].source;

    /*
    this._chart.on('finished', () => {
      for (let i = 0; i < this.frameCount.length; i++) {
        this.frameCount[i] = 0;
      }
    });
*/
    for (const dimension of legendDimensions) {
      const dimensionIndex = dimensions.indexOf(dimension);
      const seriesEntry = {
        type: 'custom',
        name: dimension,
        animationDurationUpdate: 1000
      };

      const dimensionData = data.map((arr) => arr[dimensionIndex]);
      const angles = this._createPieAngles(dimensionData);

      seriesEntry.renderItem = (params, api) => {
        const width = this._chart.getWidth();
        const height = this._chart.getHeight();
        return {
          type: 'sector',
          morph: true,
          shape: {
            cx: width / 2,
            cy: height / 2,
            r: Math.min(width, height) / 3,
            startAngle: angles[params.dataIndex][0],
            endAngle: angles[params.dataIndex][1],
            clockwise: true
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

  _createPieAngles(data) {
    let sum = 0;
    for (const item of data) {
      sum += item;
    }
    const angles = [];
    let currentAngle = -Math.PI / 2;
    for (const item of data) {
      const angle = item / sum * Math.PI * 2;
      angles.push([currentAngle, angle + currentAngle]);
      currentAngle += angle;
    }
    return angles;
  }
}
