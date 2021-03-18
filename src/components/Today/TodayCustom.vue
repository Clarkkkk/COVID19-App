<template>
  <app-chart-container
    id="today-custom"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
    <div class="btn-group">
      <button
        :class="{'active': chartType === 'bar'}"
        @click="onClick('bar')"
      >
        柱状图
      </button>
      <button
        :class="{'active': chartType === 'pie'}"
        @click="onClick('pie')"
      >
        饼图
      </button>
    </div>
  </app-chart-container>
</template>

<script>
import {CustomChart} from '@/charts';
import {AppChartContainer} from '@/components/App';
export default {
  data() {
    return {
      chartType: 'bar',
      fullscreen: {value: false}
    };
  },
  props: ['dataset'],
  components: {
    AppChartContainer
  },

  created() {
    this.chart;
    this.dimensions = ['地方名', '现存确诊', '累计确诊', '治愈', '死亡', '更新时间'];
    this.$nextTick().then(() => this.initializeChart());
  },

  watch: {
    dataset(newDataset) {
      this.chart.update({dataset: newDataset});
    }
  },

  methods: {
    onClick(type) {
      this.chartType = type;
      this.chart && this.chart.switchType(type);
    },

    initializeChart() {
      const dataset = [
        this.dataset,
        ...this.createTransforms(['现存确诊', '累计确诊', '治愈', '死亡'])
      ];
      const option = {
        title: {text: '各地数据'},
        dataset
      };
      const config = {
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        priority: 8,
        chartTypes: [{
          name: 'bar',
          config: {isVertical: false, isInverse: true}
        }, {
          name: 'pie',
        }]
      };
      this.chart = new CustomChart(this.$refs.canvas, option, config);
    },

    createTransforms(legendDimensions) {
      return legendDimensions.map((dimension) => {
        return {
          id: dimension,
          transform: {
            type: 'sort',
            config: {
              dimension,
              order: 'desc'
            }
          }
        };
      });
    }
  }
};
</script>

<style scoped>
#today-custom {
  position: relative;
  /*
  min-width: 40vw;
  height: 80vmin;
  */
}

.canvas {
  width: 100%;
  height: 100%;
}

.btn-group {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

button {
  border: 1px solid var(--app-color);
  border-right: none;
  background-color: white;
  height: 2rem;
  box-sizing: border-box;
  padding: 0 0.5rem;
  transition: all 200ms;
  cursor: pointer;
  pointer-events: all;
}

button:first-child {
  border-radius: 0.3rem 0 0 0.3rem;
}

button:last-child {
  border-right: 1px solid var(--app-color);
  border-radius: 0 0.3rem 0.3rem 0;
}

button:focus {
  outline: none;
}

button:active {
  outline: none;
  box-shadow: 0 0 5px var(--app-color);
}

button.active {
  background-color: var(--app-color);
  color: white;
}
</style>
