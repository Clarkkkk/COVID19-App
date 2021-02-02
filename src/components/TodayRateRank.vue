<template>
  <div id="today-rate-rank" class="covid-flex-item"></div>
</template>

<script>
import BarChart from '@/utils/BarChart';
export default {
  props: ['dataset', 'province'],
  created() {
    this.barChart;
  },
  watch: {
    dataset(newDataSet) {
      console.log(newDataSet);
      const dataset = this.convertDataSet(newDataSet);
      console.log(dataset);
      if (this.barChart) {
        this.barChart.update(dataset);
      } else {
        const option = {
          title: {text: '治疗率与死亡率'},
          dataset
        };
        const legendDimensions = ['估计治疗率', '住院死亡率', '累计死亡率'];
        this.barChart =
          new BarChart(this.$el, option, legendDimensions, 'percentage');
      }
    }
  },

  methods: {
    convertDataSet(dataset) {
      console.log(dataset);
      const {dimensions, source} = dataset;
      const confirmed = dimensions.indexOf('累计确诊');
      const cured = dimensions.indexOf('治愈');
      const dead = dimensions.indexOf('死亡');

      const rateDimensions = [
        '地方名',
        '估计治疗率',
        '住院死亡率',
        '累计死亡率',
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
      console.log(rateSource);
      return [{
        dimensions: rateDimensions,
        source: rateSource,
      }, {
        transform: {
          type: 'filter',
          config: {
            and: [
              {dimension: 1, '>': 0},
              {dimension: 2, '>': 0, '<': 1},
              {dimension: 3, '>': 0, '<': 1},
            ]
          },
        }
      }, {
        id: '估计治疗率',
        transform: {
          type: 'sort',
          config: {dimension: 1, order: 'desc'}
        }
      }, {
        id: '住院死亡率',
        transform: {
          type: 'sort',
          config: {dimension: 2, order: 'desc'}
        }
      }, {
        id: '累计死亡率',
        transform: {
          type: 'sort',
          config: {dimension: 3, order: 'desc'}
        }
      }];
    }
  }
};
</script>

<style scoped>
#today-rate-rank {
  min-width: 40vw;
  min-height: 60vw;
}
</style>
