<template>
  <div id="today-map" class="covid-flex-item"></div>
</template>

<script>
import MapChart from '@/utils/MapChart';
export default {
  props: ['dataset', 'area'],

  created() {
    this.map;
    this.dimensions = ['地方名', '现存确诊', '累计确诊', '治愈', '死亡', '更新时间'];
  },

  watch: {
    dataset(newDataset) {
      if (this.map) {
        // if dataset is changed, this.area shoule have been changed
        const option = {dataset: newDataset};
        console.log(newDataset);
        this.map.updateMap(option, this.area);
      } else {
        this.$nextTick().then(() => {
          const option = {
            title: {text: '今日疫情地图'},
            dataset: this.dataset
          };
          this.map = new MapChart(this.$el, option, {
            dimensions: this.dimensions,
            area: 'China'
          });
        });
      }
    }
  }
};
</script>

<style scoped>
#today-map {
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  position: relative;
  min-width: 80vw;
  height: 80vw;
  flex: 1 1 60vw;
}

@media screen and (min-aspect-ratio: 4/3) {
  #today-map {
    min-width: 60vw;
    height: 40vw;
  }
}
</style>
