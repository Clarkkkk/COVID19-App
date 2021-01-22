<template>
  <div id="app-map">

  </div>
</template>

<script>
import fetchJSON from '@/functions/fetchJSON';
import {createMap, defaultSeriousOption} from '@/functions/createMap.js';
export default {
  data() {
    return {
      chinaData: [],
      globalData: []
    };
  },

  props: ['mapOption'],

  methods: {
    initMap() {
      const series = [];
      for (let i = 1; i < this.mapOption.dataset.dimensions.length - 1; i++) {
        const option = defaultSeriousOption();
        option.name = this.mapOption.dataset.dimensions[i];
        series.push(option);
        console.log(option);
      }
      this.map = createMap(this.$el, {
        series: series,
        dataset: this.mapOption.dataset
      });
    },

    updateMap(option) {

    }
  },

  created() {

  },

  mounted() {
    this.initMap();
  }
};
</script>

<style scoped>
#app-map {
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
}

@media screen and (min-aspect-ratio: 4/3) {
  #app-map {
    width: 60vw;
    height: 40vw;
  }
}

@media not screen and (min-aspect-ratio: 4/3) {
  #app-map {
    min-width: 80vw;
    height: 60vw;
  }
}
</style>
