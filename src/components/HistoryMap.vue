<template>
  <div id="history-map" class="covid-flex-item"></div>
</template>

<script>
import MapChart from '@/utils/MapChart';
export default {
  props: ['area', 'datasetArr', 'dates'],

  created() {
    this.map;
    // for dimensionNames used in legend, create relavant series
    this.dimensionNames = [
      '现存确诊',
      '累计确诊',
      '治愈',
      '死亡'
    ];
  },

  watch: {
    datasetArr(arr) {
      console.log(arr);
      const options = arr.map((item) => {
        return {
          title: {text: '疫情地图'},
          dataset: item
        };
      });
      const basicOption = {
        title: {text: '疫情地图'},
        timeline: {data: this.dates},
        options
      };
      this.map = new MapChart(this.$el, basicOption, {
        area: 'China'
      });
    }
  }
};
</script>

<style scoped>
#history-map {
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  position: relative;
  min-width: 80vw;
  height: 80vw;
  flex: 1 1 60vw;
}

@media screen and (min-aspect-ratio: 4/3) {
  #history-map {
    min-width: 60vw;
    height: 40vw;
  }
}
</style>
