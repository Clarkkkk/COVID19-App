<template>
  <app-chart-container
    id="history-time-seires"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import {LineChart} from '@/charts';
import {AppChartContainer} from '@/components/App';
import {fetchJSON} from '@/utils';
export default {
  data() {
    return {
      fullscreen: {value: false}
    };
  },
  props: ['area'],
  components: {
    AppChartContainer
  },

  created() {
    this.chart;
    this.dimensions = ['地方名', '现存确诊', '累计确诊', '治愈', '死亡',
      '总接种剂次', '日均接种剂次', '每百人接种剂次', '新增确诊', '新增治愈', '新增死亡', '日期'];
    this.datasets = {};

    this.initializeData(this.area).then(() => {
      const option = {
        title: {
          text: '{underline|地区疫情时间线}'
        },
        dataset: this.datasets[this.area],
        legend: {
          selectedMode: 'multiple',
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            formatter: (value) => {
              if (value.includes('-01-01')) {
                return value;
              } else {
                return value.match(/[0-9]{2}-[0-9]{2}$/)[0];
              }
            }
          }
        }
      };
      const config = {
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        legendRange: [1, this.dimensions.length - 1],
        priority: 5
      };
      this.chart = new LineChart(this.$refs.canvas, option, config);
    });
  },

  activated() {
    this.chart.activated();
  },

  deactivated() {
    this.chart.deactivated();
  },

  watch: {
    area(val) {
      this.chart.showLoading();
      this.initializeData(val).then(() => {
        this.chart.update({dataset: this.datasets[val]});
      });
    }
  },

  methods: {
    initializeData(area) {
      if (this.datasets[this.area]) {
        return Promise.resolve(this.datasets[this.area]);
      } else {
        return fetchJSON('/covid/' + area).then((data) => {
          this.datasets[this.area] = this.createDataset(data);
        });
      }
    },

    createDataset(rawData) {
      return {
        dimensions: this.dimensions,
        source: rawData.data.map((item) => [
          item.Date,
          item.CurrentConfirmed,
          item.Confirmed,
          item.Recovered,
          item.Deaths,
          item.total,
          item.daily,
          item.totalPerHundred,
          item.ConfirmedIncr,
          item.RecoveredIncr,
          item.DeathsIncr,
        ])
      };
    }
  }
};
</script>

<style scoped>
</style>
