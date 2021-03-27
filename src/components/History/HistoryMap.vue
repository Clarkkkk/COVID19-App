<template>
  <app-chart-container
    id="history-map"
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
  props: ['area', 'dimensions', 'datasetArr', 'dates'],
  components: {
    AppChartContainer
  },

  created() {
    this.map;
    this.$nextTick().then(() => this.initializeChart());
  },

  activated() {
    this.map.activated();
  },

  deactivated() {
    this.map.deactivated();
  },

  watch: {
    area() {
      this.map.showLoading();
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
      this.map.update(option, this.area);
    }
  },

  methods: {
    initializeChart() {
      const options = this.createOptions(this.datasetArr);
      const basicOption = {
        title: {
          text: '{underline|疫情地图}'
        },
        timeline: {
          data: this.dates,
          axisType: 'category',
          loop: false,
          playInterval: 500
        },
        visualMap: {
          type: 'piecewise'
        },
        options
      };
      const config = {
        area: this.area,
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        priority: 10
      };
      this.map = new MapChart(this.$refs.canvas, basicOption, config);
    },

    createOptions(arr) {
      return arr.map((item) => {
        return {
          title: {
            text: '{underline|疫情地图}'
          },
          dataset: item
        };
      });
    }
  }
};
</script>

<style scoped>
</style>
