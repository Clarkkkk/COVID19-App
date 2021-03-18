<template>
  <app-chart-container
    id="history-histogram"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
  </app-chart-container>
</template>

<script>
import {HistogramChart} from '@/charts';
import {AppChartContainer} from '@/components/App';
import {
  fetchJSON,
  isoCountryToEchartsName as isoToCountry,
  isoProvinceToEchartsName as isoToProvince,
  countryPopulation,
  provincePopulation
} from '@/utils';
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
    this.dimensions = ['感染密度', '累计死亡率'];
    this.datasets = {};

    this.initializeData(this.area).then((res) => {
      const titleText = this.area === 'China' ? '中国' : '全球';
      this.chart = new HistogramChart(this.$refs.canvas, {
        title: {
          text: titleText + '各地区疫情指标直方图'
        },
        dataset: this.datasets[this.area]
      }, {
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        valueType: 'decimal',
        valueUnit: ['人/百万人', '%'],
        legendRange: [0, this.dimensions.length]
      });
    });
  },

  watch: {
    area(val) {
      const titleText = this.area === 'China' ? '中国' : '全球';
      this.chart.showLoading();
      this.initializeData(val).then(() => {
        this.chart.update({
          title: {
            text: titleText + '各地区疫情指标直方图'
          },
          dataset: this.datasets[val]
        });
      });
    }
  },

  methods: {
    initializeData(area) {
      if (this.datasets[this.area]) {
        return Promise.resolve(this.datasets[this.area]);
      } else {
        return fetchJSON('/latest').then((res) => {
          this.datasets[this.area] = this.createDataset(res);
        });
      }
    },

    getPopulation(isoCode) {
      if (isoToCountry[isoCode]) {
        return countryPopulation[isoToCountry[isoCode]];
      } else if (isoToProvince[isoCode]) {
        return provincePopulation[isoToProvince[isoCode]];
      }
    },

    createDataset(rawData) {
      const source = [];
      const worldPopulation = Object.keys(countryPopulation)
        .map((key) => countryPopulation[key])
        .reduce((prev, curr) => prev + curr, 0);
      if (this.area === 'World') {
        for (const item of rawData) {
          const population = item.country === 'World' ?
            worldPopulation : this.getPopulation(item.iso);
          source.push([
            item.data.Confirmed / population * 1000000,
            item.data.Deaths / item.data.Confirmed * 100
          ]);
        }
      } else {
        const countryData = rawData.find((item) => item.country === this.area);
        for (const item of countryData.provinces) {
          source.push([
            item.data.Confirmed / this.getPopulation(item.iso) * 1000000,
            item.data.Deaths / item.data.Confirmed * 100
          ]);
        }
      }
      return {
        dimensions: this.dimensions,
        source
      };
    }
  }
};
</script>

<style scoped>
/*
#history-histogram {
  min-width: 40vw;
  height: 80vmin;
}
*/

.canvas {
  width: 100%;
  height: 100%;
}
</style>
