<template>
  <app-chart-container
    id="history-time-seires"
    class="covid-flex-item"
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

  mounted() {
    this.chart;
    this.dimensions = ['日期', '现存确诊', '累计确诊', '治愈', '死亡',
      '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡'];

    fetchJSON('/countries/' + this.area).then((data) => {
      this.dataset = this.createDataset(data);
      return this.$nextTick();
    }).then(() => {
      const option = {
        title: {text: `地区疫情时间线`},
        dataset: this.dataset,
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
        fullscreen: this.fullscreen
      };
      this.chart = new LineChart(this.$refs.canvas, option, config);
    });
  },

  methods: {
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
#history-time-seires {
  width: 90vw;
  height: 80vmin;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
