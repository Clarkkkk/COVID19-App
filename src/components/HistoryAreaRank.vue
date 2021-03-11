<template>
  <app-chart-container
    id="history-area-rank"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import BarChart from '@/utils/BarChart';
import AppChartContainer from '@/components/AppChartContainer';
export default {
  data() {
    return {
      fullscreen: {value: false}
    };
  },
  props: ['area', 'datasetArr', 'dimensions', 'dates'],
  components: {
    AppChartContainer
  },
  methods: {
    createSortTransform(dimensions) {
      return dimensions.map((dimension, index) => {
        return {
          id: dimension,
          transform: {
            type: 'sort',
            config: {dimension: index, order: 'desc'}
          }
        };
      });
    }
  },
  watch: {
    datasetArr(arr) {
      const options = arr.map((item) => {
        const date = item.source[0][item.source[0].length - 1];
        return {
          title: {
            text: '疫情地区排行',
            subtext: date
          },
          dataset: [item, ...this.createSortTransform(item.dimensions)]
        };
      });
      const basicOption = {
        title: {
          text: '疫情地区排行',
          subtext: ''
        },
        timeline: {
          data: this.dates,
          axisType: 'category',
          loop: false,
          playInterval: 500,
          label: {
            interval: 5,
          }
        },
        dataZoom: {
          type: 'slider',
          orient: 'vertical',
          brushSelect: false,
          startValue: 0,
          endValue: 19,
          zoomLock: false,
          rangeMode: ['value', 'value']
        },
        options
      };
      if (this.chart) {
        this.chart.update(basicOption);
      } else {
        this.chart =
          new BarChart(this.$refs.canvas, basicOption, {
            valueType: 'integer',
            dimensions: this.dimensions,
            fullscreen: this.fullscreen,
          });
      }
    }
  }
};
</script>

<style scoped>
/*
#history-area-rank {
  min-width: 20rem;
  min-height: 32rem;
  height: 32rem;
  flex: 1 1 18rem;
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
}
*/

.canvas {
  width: 100%;
  height: 100%;
}
</style>
