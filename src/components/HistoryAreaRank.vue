<template>
  <div id="history-area-rank" class="covid-flex-item"></div>
</template>

<script>
import BarChart from '@/utils/BarChart';
export default {
  props: ['area', 'datasetArr', 'dimensions', 'dates'],
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
      console.log(arr);
      const options = arr.map((item) => {
        const date = item.source[0][item.source[0].length - 1];
        return {
          title: {text: '疫情地区排行 | ' + date},
          dataset: [item, ...this.createSortTransform(item.dimensions)]
        };
      });
      const basicOption = {
        title: {text: '疫情地区排行'},
        timeline: {
          data: this.dates,
          axisType: 'category',
          loop: false,
          playInterval: 500,
          label: {
            interval: 5,
          },
          left: 10,
          right: 0
        },
        legend: {
          left: 0,
          bottom: 50,
          orient: 'horizontal',
          selectedMode: 'single',
        },
        grid: {
          left: 50,
          right: 60,
          top: 60,
          bottom: 150
        },
        dataZoom: {
          type: 'slider',
          orient: 'vertical',
          right: 0,
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
          new BarChart(this.$el, basicOption, {
            valueType: 'integer',
            dimensions: this.dimensions
          });
      }
    }
  }
};
</script>

<style scoped>
#history-area-rank {
  min-width: 20rem;
  min-height: 32rem;
  flex: 1 1 18rem;
  padding: 0.5rem;
  box-sizing: border-box;
  color: #222;
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  align-items: end;
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
}
</style>
