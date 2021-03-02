<template>
  <div id="today-scatter" class="covid-flex-item">
    <div class="canvas" ref="canvas"></div>
  </div>
</template>

<script>
import ScatterChart from '@/utils/ScatterChart';
export default {
  props: ['dataset'],
  created() {
    this.scatterChart;
  },
  watch: {
    dataset(newDataset) {
      const dataset = this.convertDataset(newDataset);
      if (this.scatterChart) {
        this.scatterChart.update(dataset);
      } else {
        const option = {
          title: {text: '估计治疗率与各指标散点图'},
          dataset
        };
        const legendDimensions = ['估计治疗率与住院死亡率'];
        this.scatterChart =
          new ScatterChart(this.$refs.canvas, option, {
            dimensionNames: legendDimensions
          });
      }
    }
  },

  methods: {
    convertDataset(dataset) {
      const {dimensions, source} = dataset;
      const confirmed = dimensions.indexOf('累计确诊');
      const cured = dimensions.indexOf('治愈');
      const dead = dimensions.indexOf('死亡');

      const rateDimensions = [
        '地方名',
        '估计治疗率',
        '住院死亡率',
        '更新时间'
      ];
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
        dimensions: rateDimensions,
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
  min-width: 40vw;
  height: 80vmin;
}
</style>
