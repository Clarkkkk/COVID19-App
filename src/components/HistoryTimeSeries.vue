<template>
  <app-chart-container
    id="history-time-seires"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import LineChart from '@/utils/LineChart';
import AppChartContainer from '@/components/AppChartContainer';
import fetchJSON from '@/utils/fetchJSON';
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

  watch: {
    area(val) {
      this.initializeData(val).then(() => {
        this.chart.update({dataset: this.datasets[val]});
      });
    }
  },

  mounted() {
    this.chart;
    this.dimensions = ['日期', '现存确诊', '累计确诊', '治愈', '死亡',
      '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡'];
    this.datasets = {};

    this.initializeData(this.area).then(() => {
      const option = {
        title: {text: `地区疫情时间线`},
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
        priority: 5
      };
      this.chart = new LineChart(this.$refs.canvas, option, config);
    });
  },

  methods: {
    initializeData(area) {
      if (this.datasets[this.area]) {
        return Promise.resolve(this.datasets[this.area]);
      } else {
        return fetchJSON('/countries/' + area).then((data) => {
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
          item.CurrentConfirmedIncr,
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
/*
#history-time-seires {
  width: 100%;
  height: 80vmin;
}
*/

.canvas {
  width: 100%;
  height: 100%;
}
</style>
