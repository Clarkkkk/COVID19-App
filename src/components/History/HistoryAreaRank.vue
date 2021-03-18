<template>
  <app-chart-container
    id="history-area-rank"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import {BarChart} from '@/charts';
import {AppChartContainer} from '@/components/App';
export default {
  data() {
    return {
      fullscreen: {value: false}
    };
  },
  props: ['area', 'dimensions', 'datasetArr', 'dates'],
  components: {
    AppChartContainer
  },

  created() {
    this.chart;
    this.$nextTick().then(() => this.initializeChart());
  },

  watch: {
    area() {
      this.chart.showLoading();
    },

    datasetArr(arr) {
      // the data of the current area is not fetched yet
      if (!arr) {
        return;
      }

      const option = {
        timeline: {data: this.dates},
        options: this.createOptions(arr)
      };
      this.chart.update(option);
    }
  },

  methods: {
    initializeChart() {
      const options = this.createOptions(this.datasetArr);
      const basicOption = {
        title: {
          text: '疫情地区排行',
          subtext: ''
        },
        timeline: {
          data: this.dates,
          axisType: 'category',
          loop: false,
          playInterval: 500
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
      const config = {
        valueType: 'integer',
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        priority: 8
      };
      this.chart = new BarChart(this.$refs.canvas, basicOption, config);
    },

    createOptions(arr) {
      return arr.map((item) => {
        const date = item.source[0][item.source[0].length - 1];
        return {
          title: {
            text: '疫情地区排行',
            subtext: date
          },
          dataset: [item, ...this.createSortTransform(item.dimensions)]
        };
      });
    },

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
