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
        title: {text: '疫情地图'},
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
        const date = item.source[0][item.source[0].length - 1];
        return {
          title: {
            text: '疫情地图',
            subtext: date
          },
          dataset: item
        };
      });
    }
  }
};
</script>

<style scoped>
/*
#history-map {
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  position: relative;
  min-width: 80vw;
  height: 80vw;
  flex: 1 1 50vw;
}

@media screen and (min-aspect-ratio: 4/3) {
  #history-map {
    min-width: 60vw;
    height: 50vw;
  }
}
*/

.canvas {
  width: 100%;
  height: 100%;
}
</style>
