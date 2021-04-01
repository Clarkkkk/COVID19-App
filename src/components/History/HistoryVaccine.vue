<template>
  <app-chart-container
    id="history-time-seires"
    :fullscreen="fullscreen"
  >
    <div class="select-container">
      <div class="select is-small">
        <select v-model="selected">
          <option v-for="option in selectGroup" :key="option">
            {{option}}
          </option>
        </select>
      </div>
    </div>
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import {ScatterChart3d} from '@/charts';
import {AppChartContainer} from '@/components/App';
import {
  fetchJSON,
  echartsNameToIsoCountry as countryToIso
} from '@/utils';
export default {
  data() {
    return {
      fullscreen: {value: false},
      selected: '世界',
      selectGroup: ['世界', '中国', '美国', '法国', '英国', '德国', '意大利', '印度', '俄罗斯', '以色列', '日本']
    };
  },

  computed: {
    /** @return { string } **/
    area() {
      return countryToIso[this.selected];
    }
  },

  watch: {
    area(val) {
      this.initializeData().then(() => {
        this.chart.update({
          dataset: this.datasets[val]
        });
      });
    }
  },

  components: {
    AppChartContainer
  },

  created() {
    this.chart;
    this.dimensions = ['日期', '新增累计确诊', '总接种剂次', '日均接种剂次', '每百人接种剂次'];
    this.datasets = {};
    this.initializeData().then(() => {
      const option = {
        title: {text: '{underline|疫苗与新增确诊散点图}'},
        dataset: this.datasets[this.area],
        xAxis3D: {
          type: 'category',
          axisLabel: {
            formatter(value) {
              return value.match(/[0-9]{2}-[0-9]{2}$/);
            }
          }
        }
      };
      const config = {
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        seriesEncode: [
          {
            name: '新增确诊与总接种剂次',
            encode: [0, 1, 2]
          }, {
            name: '新增确诊与日均接种剂次',
            encode: [0, 1, 3]
          }, {
            name: '新增确诊与每百人接种剂次',
            encode: [0, 1, 4]
          }
        ]
      };
      this.chart = new ScatterChart3d(this.$refs.canvas, option, config);
    });
  },

  methods: {
    initializeData() {
      if (this.datasets[this.area]) {
        return Promise.resolve(this.datasets[this.area]);
      } else {
        return Promise.all([
          fetchJSON('/vaccine/' + this.area),
          fetchJSON('/covid/' + this.area)
        ]).then((data) => {
          this.datasets[this.area] = this.createDataset(data);
        });
      }
    },

    createDataset(rawData) {
      const vaccineData = rawData[0].data;
      console.log(vaccineData);
      const covidData = rawData[1].data;
      const source = [];
      let start;
      for (let i = 0; i < covidData.length; i++) {
        if (covidData[i].Date === vaccineData[0].date) {
          start = i;
        }

        if (start !== undefined) {
          source[i - start] = [];
          source[i - start].push(
            covidData[i].Date,
            covidData[i].ConfirmedIncr,
            vaccineData[i - start]?.total,
            vaccineData[i - start]?.daily,
            vaccineData[i - start]?.totalPerHundred
          );
        }
      }
      return {
        dimensions: this.dimensions,
        source
      };
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import "bulma/sass/utilities/mixins";
#history-time-seires {
  position: relative;
}

.select-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(4.5rem + #{$padding-small});
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}

.select, select {
  cursor: pointer;
  pointer-events: all;
}

@include desktop {
  .select-container {
    height: calc(1.5rem + #{$padding-normal});
  }
}
</style>
