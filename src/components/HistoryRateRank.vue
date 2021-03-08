<template>
  <app-chart-container
    id="history-rate-rank"
    class="covid-flex-item"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import BarChart from '@/utils/BarChart';
import AppChartContainer from '@/components/AppChartContainer';
import {countryPopulation, provincePopulation} from '@/utils/mappings.js';
export default {
  data() {
    return {
      fullscreen: {value: false}
    };
  },
  props: ['area', 'datasetArr', 'dates'],
  components: {
    AppChartContainer
  },
  created() {
    this.chart;
    this.dimensions = [
      '地方名',
      '估计治疗率',
      '住院死亡率',
      '累计死亡率',
      '感染密度',
      '死亡密度',
      '日期'
    ];
  },
  watch: {
    datasetArr(arr) {
      const converted = this.convertDatasetArr(arr);
      const options = converted.map((item) => {
        const date = item[0].source[0][item[0].source[0].length - 1];
        return {
          title: {text: '治疗率、死亡率与疫情人口密度 | ' + date},
          dataset: item
        };
      });
      const basicOption = {
        title: {text: '治疗率、死亡率与疫情人口密度'},
        timeline: {
          data: this.dates,
          axisType: 'category',
          loop: false,
          playInterval: 500,
          label: {
            interval: 5,
          },
          left: 10,
          right: 0
        },
        legend: {
          left: 0,
          bottom: 50,
          orient: 'horizontal',
          selectedMode: 'single',
        },
        grid: {
          left: 50,
          right: 60,
          top: 60,
          bottom: 150
        },
        dataZoom: {
          type: 'slider',
          orient: 'vertical',
          right: 0,
          brushSelect: false,
          startValue: 0,
          endValue: 19,
          zoomLock: false,
          rangeMode: ['value', 'value']
        },
        options
      };
      if (this.chart) {
        this.chart.update(basicOption);
      } else {
        this.chart = new BarChart(this.$refs.canvas, basicOption, {
          dimensions: this.dimensions,
          fullscreen: this.fullscreen,
          valueType:
            ['percentage', 'percentage', 'percentage', 'decimal', 'decimal'],
        });
      }
    }
  },

  methods: {
    convertDatasetArr(arr) {
      return arr.map((dataset) => {
        const {dimensions, source} = dataset;
        const confirmed = dimensions.indexOf('累计确诊');
        const cured = dimensions.indexOf('治愈');
        const dead = dimensions.indexOf('死亡');

        const rateSource = source.map((entry) => {
          const population =
            countryPopulation[entry[0]] || provincePopulation[entry[0]];
          return [
            // 地方名
            entry[0],
            // 估计治疗率
            (entry[cured] + entry[dead]) / entry[confirmed],
            // 住院死亡率
            entry[dead] / (entry[cured] + entry[dead]),
            // 累计死亡率
            entry[dead] / entry[confirmed],
            // 感染密度
            entry[confirmed] / population * 1000000,
            // 死亡密度
            entry[dead] / population * 1000000,
            // 日期
            entry[entry.length - 1]
          ];
        });
        return [{
          dimensions: this.dimensions,
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
        }, {
          id: '感染密度',
          transform: [{
            type: 'sort',
            config: {dimension: 4, order: 'desc'}
          }]
        }, {
          id: '死亡密度',
          transform: [{
            type: 'sort',
            config: {dimension: 5, order: 'desc'}
          }]
        }];
      });
    }
  }
};
</script>

<style scoped>
#history-rate-rank {
  min-width: 40vw;
  height: 80vmin;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
