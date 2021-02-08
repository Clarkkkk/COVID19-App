<template>
  <div id="today-custom" class="covid-flex-item"></div>
</template>

<script>
import CustomChart from '@/utils/CustomChart';
export default {
  props: ['dataset', 'province'],

  created() {
    this.chart;
    // for dimensionNames used in legend, create relavant series
    this.dimensionNames = [
      '现存确诊',
      '累计确诊',
      '治愈',
      '死亡'
    ];
  },

  watch: {
    dataset(newDataSet) {
      if (this.chart) {
        // if dataset is changed, this.province shoule have been changed
        const option = {dataset: newDataSet};
        console.log(newDataSet);
        this.chart.update(option, this.province);
      } else {
        this.$nextTick().then(() => {
          const option = {
            title: {text: '各地数据'},
            dataset: this.dataset
          };
          console.log(this.dataset);
          this.chart = new CustomChart(this.$el, option, {
            chartTypes: [{
              name: 'bar',
              config: {isVertical: true, isInverse: true}
            }]
          });
        });
      }
    }
  }
};
</script>

<style scoped>
#today-custom {
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  position: relative;
  min-width: 80vw;
  height: 80vw;
  flex: 1 1 60vw;
}

@media screen and (min-aspect-ratio: 4/3) {
  #today-custom {
    min-width: 60vw;
    height: 40vw;
  }
}
</style>
