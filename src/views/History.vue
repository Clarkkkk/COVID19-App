<template>
  <div id="history" class="columns is-multiline">
    <template v-if="dataAvailable">
    <div class="header column is-full">
      <div class="select">
        <select v-model="selected">
          <option v-for="option in selectGroup" :key="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <history-map
      class="column is-three-fifths"
      :area="currentArea"
      :dimensions="defaultDimensions"
      :datasetArr="currentDatasetArr"
      :dates="dates"
    />
    <history-area-rank
      class="column is-two-fifths"
      :area="currentArea"
      :dimensions="defaultDimensions"
      :datasetArr="currentDatasetArr"
      :dates="dates"
    />

    <history-time-series
      class="column is-full"
      :area="currentArea"
    />

    <history-rate-rank
      class="column is-half"
      :area="currentArea"
      :datasetArr="currentDatasetArr"
      :dates="dates"
    />
    <history-histogram
      class="column is-half"
      :area="currentArea"
    />
    <history-vaccine
      class="column is-full"
      :area="currentArea"
    />
    </template>
    <app-loading-icon class="tile is-parent" v-else ref="map" />
  </div>
</template>

<script>
import {
  HistoryMap,
  HistoryAreaRank,
  HistoryRateRank,
  HistoryTimeSeries,
  HistoryHistogram,
  HistoryVaccine
} from '@/components/History';
import {AppLoadingIcon} from '@/components/App';
import {
  isoCountryToEchartsName as isoToCountry,
  isoProvinceToEchartsName as isoToProvince,
  createDebounce,
  fetchJSON
} from '@/utils';
const debounce = createDebounce(5000);
export default {
  data() {
    return {
      selectGroup: ['中国', '世界'],
      selected: '中国',
      currentArea: 'China',
      datasetArrays: {
        China: undefined,
        World: undefined
      },
      dates: [],
      dataAvailable: false
    };
  },

  components: {
    HistoryMap,
    HistoryAreaRank,
    HistoryRateRank,
    HistoryTimeSeries,
    HistoryHistogram,
    HistoryVaccine,
    AppLoadingIcon
  },

  computed: {
    /** @return { array } **/
    currentDatasetArr() {
      return this.datasetArrays[this.currentArea];
    }
  },

  created() {
    this.initializeData(this.currentArea);
    this.defaultDimensions = ['地方名', '现存确诊', '累计确诊', '治愈', '死亡',
      '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡', '日期'];
  },

  watch: {
    selected(area) {
      // the currentArea is used in series's map name
      if (area === '中国') {
        this.currentArea = 'China';
      } else if (area === '世界') {
        this.currentArea = 'World';
      }

      if (!this.datasetArrays[this.currentArea]) {
        this.initializeData(this.currentArea);
      }
    }
  },

  methods: {
    async initializeData(area) {
      const limit = 30;
      let page = 0;
      let more = true;
      let isFirstFetch = true;
      let areaDataArr;
      while (more) {
        // fetch and normalize data
        const rawData =
          await fetchJSON(`/covid/${area}/all`, {limit, page});
        const data = this.normalizeData(rawData);
        const dates = rawData.data.map((item) => item.Date);

        const thisArr = this.datasetArrays;
        if (isFirstFetch) {
          // use the first page of data to render the chart
          this.dates = dates;
          thisArr[area] = areaDataArr = Object.freeze(data);
          isFirstFetch = false;
          // wait for the router change animation
          setTimeout(() => this.dataAvailable = true, 500);
        } else {
          this.dates = [...this.dates, ...dates];
          // append new data and save it to the array
          areaDataArr = Object.freeze([...areaDataArr, ...data]);
          if (this.currentArea === area) {
            // debounce the assignment to reduce re-render
            debounce(() => thisArr[area] = areaDataArr);
          } else {
            thisArr[area] = areaDataArr;
          }
        }
        more = rawData.more;
        page++;
      }
    },

    normalizeData(rawData) {
      const sources = [];
      for (const item of rawData.provinces) {
        const provinceData = item.data;
        provinceData.forEach((singleDayData, index) => {
          // The data of two cruise ships, MS Zaandam and Diamond Princess
          // and the data of Holy See(VA) and Marshall Islands(MH)
          if (!(isoToCountry[item.iso] || isoToProvince[item.iso])) {
            return;
          }

          // initialize sources[index]
          if (!sources[index]) {
            sources[index] = [];
          }

          // the province's data in different days
          sources[index].push([
            isoToCountry[item.iso] || isoToProvince[item.iso],
            singleDayData.CurrentConfirmed,
            singleDayData.Confirmed,
            singleDayData.Recovered,
            singleDayData.Deaths,
            singleDayData.CurrentConfirmedIncr,
            singleDayData.ConfirmedIncr,
            singleDayData.RecoveredIncr,
            singleDayData.DeathsIncr,
            singleDayData.Date
          ]);
        });
      }
      return sources.map((source) => {
        return {
          dimensions: this.defaultDimensions,
          source
        };
      });
    }
  }
};
</script>

<style scoped>
.columns {
  width: 100%;
}

.column {
  height: 80vh;
  box-sizing: border-box;
}

.header {
  width: 100%;
  height: 5rem;
  padding: 0.75rem;
  margin-top: 0.75rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.graphs {
  flex: 2 1 50vw;
}
</style>
