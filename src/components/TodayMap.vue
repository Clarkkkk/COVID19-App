<template>
  <div id="today-map" class="covid-flex-item"></div>
</template>

<script>
import mapHelper from '@/utils/mapHelper.js';
export default {
  props: ['dataset', 'province'],

  watch: {
    dataset(newDataSet) {
      if (this.map) {
        this.switchMap(this.province, newDataSet);
      } else {
        this.$nextTick().then(() => {
          const series = this.createSeriesOption(this.province);
          const option = {
            title: {
              text: '今日疫情地图'
            },
            series,
            dataset: this.dataset
          };
          this.map = mapHelper.createMap(this.$el, option);
        });
      }
    }
  },
  methods: {
    // mapName should be in Chinese
    createSeriesOption(mapName) {
      const series = [];
      // for dimensionNames used in legend, create relavant series
      const dimensionNames = [
        '现存确诊',
        '累计确诊',
        '治愈',
        '死亡'
      ];
      for (let i = 0; i < dimensionNames.length; i++) {
        const option = mapHelper.createBasicOption('series');
        option.map = mapName;
        option.name = dimensionNames[i];
        series.push(option);
      }
      return series;
    },

    switchMap(province, dataset) {
      const series = this.createSeriesOption(province);
      const option = {
        series: series,
        dataset: dataset
      };
      mapHelper.updateMap(option, province, this.map);
    }
  },
};
</script>

<style scoped>
#today-map {
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  position: relative;
  min-width: 80vw;
  height: 80vw;
  flex: 1 1 auto;
}

@media screen and (min-aspect-ratio: 4/3) {
  #today-map {
    min-width: 60vw;
    height: 40vw;
  }
}
</style>
