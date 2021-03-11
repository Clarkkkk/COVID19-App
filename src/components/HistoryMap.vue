<template>
  <app-chart-container
    id="history-map"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import MapChart from '@/utils/MapChart';
import AppChartContainer from '@/components/AppChartContainer';
export default {
  data() {
    return {
      fullscreen: {value: false}
    };
  },
  props: ['area', 'datasetArr', 'dimensions', 'dates'],
  components: {
    AppChartContainer
  },
  created() {
    this.map;
  },

  watch: {
    datasetArr(arr) {
      const options = arr.map((item) => {
        const date = item.source[0][item.source[0].length - 1];
        return {
          title: {
            text: '疫情地图',
            subtext: date
          },
          dataset: item
        };
      });
      const basicOption = {
        title: {text: '疫情地图'},
        timeline: {
          data: this.dates,
          axisType: 'category',
          label: {
            interval: 5,
          },
        },
        visualMap: {
          type: 'piecewise'
        },
        options
      };
      if (this.map) {
        this.map.updateMap(basicOption, this.area);
      } else {
        this.map = new MapChart(this.$refs.canvas, basicOption, {
          area: this.area,
          dimensions: this.dimensions,
          fullscreen: this.fullscreen
        });
      }
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
