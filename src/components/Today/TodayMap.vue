<template>
  <app-chart-container
    id="today-map"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import {MapChart} from '@/charts';
import {AppChartContainer} from '@/components/App';
export default {
  data() {
    return {
      fullscreen: {value: false}
    };
  },
  props: ['dataset', 'area'],
  components: {
    AppChartContainer
  },

  created() {
    this.map;
    this.dimensions = ['地方名', '现存确诊', '累计确诊', '治愈', '死亡', '更新时间'];
    this.$nextTick().then(() => this.initializeChart());
  },

  watch: {
    dataset(newDataset) {
      // if dataset is changed, this.area shoule have been changed
      const option = {dataset: newDataset};
      this.map.showLoading();
      this.map.update(option, this.area);
    }
  },

  methods: {
    initializeChart() {
      console.log(this.dataset);
      console.log(this);
      const option = {
        title: {text: '{underline|疫情地图}'},
        dataset: this.dataset
      };
      this.map = new MapChart(this.$refs.canvas, option, {
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        priority: 10,
        area: 'China'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
