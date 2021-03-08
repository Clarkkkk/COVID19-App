<template>
  <app-chart-container
    id="today-scatter"
    class="covid-flex-item"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import ScatterChart from '@/utils/ScatterChart';
import AppChartContainer from '@/components/AppChartContainer';
export default {
  data() {
    return {
      fullscreen: {value: false}
    };
  },
  props: ['dataset'],
  components: {
    AppChartContainer
  },
  created() {
    this.chart;
    this.dimensions = [
      '地方名',
      '估计治疗率',
      '住院死亡率',
      '更新时间'
    ];
  },
  watch: {
    dataset(newDataset) {
      const dataset = this.convertDataset(newDataset);
      if (this.chart) {
        this.chart.update({dataset});
      } else {
        const option = {
          title: {text: '估计治疗率与各指标散点图'},
          dataset
        };
        const config = {
          dimensions: this.dimensions,
          fullscreen: this.fullscreen,
        };
        this.chart = new ScatterChart(this.$refs.canvas, option, config);
      }
    }
  },

  methods: {
    convertDataset(dataset) {
      const {dimensions, source} = dataset;
      const confirmed = dimensions.indexOf('累计确诊');
      const cured = dimensions.indexOf('治愈');
      const dead = dimensions.indexOf('死亡');

      const rateSource = source.map((entry) => {
        return [
          // 地方名
          entry[0],
          // 估计治疗率
          (entry[cured] + entry[dead]) / entry[confirmed],
          // 住院死亡率
          entry[dead] / (entry[cured] + entry[dead]),
          // 累计死亡率
          entry[dead] / entry[confirmed],
          // 更新时间
          entry[entry.length - 1]
        ];
      });
      return [{
        dimensions: this.imensions,
        source: rateSource,
      }, {
        transform: {
          type: 'filter',
          config: {
            and: [
              {dimension: 1, '>': 0},
              {dimension: 2, '>': 0, '<': 1}
            ]
          },
        }
      }];
    }
  }
};
</script>

<style scoped>
#today-scatter {
  min-width: 40vw;
  height: 80vmin;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
