<template>
  <div id="history-histogram" class="covid-flex-item"></div>
</template>

<script>
import fetchJSON from '@/utils/fetchJSON';
import HistogramChart from '@/utils/HistogramChart';
import {
  isoCountryToEchartsName as isoToCountry,
  isoProvinceToEchartsName as isoToProvince,
  countryPopulation,
  provincePopulation
} from '@/utils/mappings.js';
export default {
  props: ['area'],
  mounted() {
    this.chart;
    this.dimensions = ['感染密度', '累计死亡率'];

    fetchJSON('/latest').then((res) => {
      const dataset = this.createDataset(res);
      console.log(dataset);
      this.chart = new HistogramChart(this.$el, {
        title: {
          text: this.area + '各地区疫情指标直方图'
        },
        dataset
      }, {
        dimensions: this.dimensions,
        legendRange: [0, this.dimensions.length]
      });
    });
  },

  methods: {
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
#history-histogram {
  min-width: 40vw;
  height: 80vmin;
}
</style>
