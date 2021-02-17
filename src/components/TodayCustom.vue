<template>
  <div id="today-custom" class="covid-flex-item">
    <div class="canvas" ref="canvas"></div>
    <div class="btn-group">
      <button
        :class="{'active': chartType === 'bar'}"
        @click="onClick('bar')"
      >柱状图</button>
      <button
        :class="{'active': chartType === 'pie'}"
        @click="onClick('pie')"
      >饼图</button>
    </div>
  </div>
</template>

<script>
import CustomChart from '@/utils/CustomChart';
export default {
  data() {
    return {
      chartType: 'bar'
    };
  },
  props: ['dataset', 'province'],

  methods: {
    onClick(type) {
      this.chartType = type;
      this.chart.switchType(type);
    }
  },

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
        this.chart.update(newDataSet);
      } else {
        this.$nextTick().then(() => {
          const option = {
            title: {text: '各地数据'},
            dataset: this.dataset
          };
          console.log(this.dataset);
          this.chart = new CustomChart(this.$refs.canvas, option, {
            chartTypes: [{
              name: 'bar',
              config: {isVertical: false, isInverse: true}
            }, {
              name: 'pie',
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
  position: relative;
  min-width: 40vw;
  height: 80vmin;
}

.canvas {
  min-width: 40vw;
  height: 80vmin;
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
