import BasicChart from '@/utils/BasicChart.js';

export default class CustomChart extends BasicChart {
  constructor(elem, option, {valueType, chartTypes}) {
    super(elem, option, {valueType});
    this.chartTypes = chartTypes;
    this.options = this._createOptions();
    this._setOption(this.options[0]);
  }

  update(dataset) {
    this._setOption({dataset});
  }

  _createOptions() {
    const options = [];
    for (const type of this.chartTypes) {
      if (type.name === 'bar') {
        options.push(this._createBarOption(type.config));
      }
    }
    return options;
  }

  _createBarOption({isVertical, isInverse, stack}) {
    const option = {
      xAxis: {
        type: isVertical ? 'category' : 'value',
        inverse: isVertical && isInverse
      },
      yAxis: {
        type: isVertical ? 'value' : 'category',
        inverse: !isVertical && isInverse
      },
      dataZoom: {
        orient: isVertical ? 'horizontal' : 'vertical'
      },
      legend: {
        selectedMode: 'multiple',
        orient: 'vertical',
        left: 10,
        bottom: 10
      },
      grid: [{
        left: 210,
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
    for (const dimension of legendDimensions) {
      const dimensionIndex = dimensions.indexOf(dimension);
      const seriesEntry = {
        type: 'custom',
        name: dimension
      };

      seriesEntry.encode = isVertical ?
        {x: 0, y: dimensionIndex} :
        {x: dimensionIndex, y: 0};

      seriesEntry.renderItem = (params, api) => {
        const xValue = api.value(seriesEntry.encode.x);
        const yValue = api.value(seriesEntry.encode.y);
        const [xCoord, yCoord] = api.coord([xValue, yValue]);
        console.log(yValue);
        console.log(yCoord);
        const xAxisLength = params.coordSys.width;
        const yAxisLength = params.coordSys.height;
        const gridX = params.coordSys.x;
        const gridY = params.coordSys.y;
        const dataCount = params.dataInsideLength;
        // const sizes = api.size([api.value(1), api.value(1)]);

        // the width of bars is twice as the gap width
        const gapWidth =
          (isVertical ? xAxisLength : yAxisLength) / dataCount / 3;
        const obj = {
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
          style: api.style(),
          // focus is specified outside of emphasis
          // which is different from normal series
          focus: 'self',
          emphasis: api.styleEmphasis()
        };
        console.log(obj);
        return obj;
      };

      option.series.push(seriesEntry);
    }
    console.log(option);
    return option;
  }
}
