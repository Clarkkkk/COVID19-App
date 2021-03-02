<template>
  <div id="today-rate-rank" class="covid-flex-item"></div>
</template>

<script>
import BarChart from '@/utils/BarChart';
export default {
  props: ['dataset'],
  created() {
    this.barChart;
  },
  watch: {
    dataset(newDataset) {
      const dataset = this.convertDataset(newDataset);
      if (this.barChart) {
        this.barChart.update(dataset);
      } else {
        const option = {
          title: {text: '治疗率与死亡率'},
          dataset
        };
        this.barChart = new BarChart(this.$el, option, {
          valueType: 'percentage'
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
      return [{
        dimensions: rateDimensions,
        source: rateSource,
      }, {
        id: '估计治疗率',
        transform: [{
          type: 'sort',
          config: {dimension: 1, order: 'desc'}
        }, {
          type: 'filter',
          config: {dimension: 1, '>': 0}
        }]
      }, {
        id: '住院死亡率',
        transform: [{
          type: 'sort',
          config: {dimension: 2, order: 'desc'}
        }, {
          type: 'filter',
          config: {dimension: 2, '>': 0, '<': 1}
        }]
      }, {
        id: '累计死亡率',
        transform: [{
          type: 'sort',
          config: {dimension: 3, order: 'desc'}
        }, {
          type: 'filter',
          config: {dimension: 3, '>': 0, '<': 1}
        }]
      }];
    }
  }
};
</script>

<style scoped>
#today-rate-rank {
  min-width: 40vw;
  height: 80vmin;
}
</style>
