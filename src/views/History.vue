<template>
  <div id="history" class="columns is-multiline">
    <div class="header column is-full">
      <span class="title">历史数据</span>
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
      :dimensions="dimensions"
      :datasetArr="currentDatasetArr"
      :dates="dates"
    />
    <history-area-rank
      class="column is-two-fifths"
      :area="currentArea"
      :dimensions="dimensions"
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
  </div>
</template>

<script>
import HistoryMap from '@/components/HistoryMap';
import HistoryAreaRank from '@/components/HistoryAreaRank';
import HistoryRateRank from '@/components/HistoryRateRank';
import HistoryTimeSeries from '@/components/HistoryTimeSeries';
import HistoryHistogram from '@/components/HistoryHistogram';
import {
  isoCountryToEchartsName as isoToCountry,
  isoProvinceToEchartsName as isoToProvince
} from '@/utils/mappings.js';
import fetchJSON from '@/utils/fetchJSON';
export default {
  data() {
    return {
      // eslint-disable-next-line max-len
      selectGroup: ['中国', '世界'],
      selected: '中国',
      currentArea: 'China',
      dimensions: ['地方名', '现存确诊', '累计确诊', '治愈', '死亡',
        '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡', '日期'],
      currentDatasetArr: [],
      dates: []
    };
  },

  watch: {
    selected(area) {
      // the currentArea is used in series's map name
      if (area === '中国') {
        this.currentArea = 'China';
        this.initializeData('China');
      } else if (area === '世界') {
        this.currentArea = 'World';
        this.initializeData('World');
      }
    }
  },

  components: {
    HistoryMap,
    HistoryAreaRank,
    HistoryRateRank,
    HistoryTimeSeries,
    HistoryHistogram
  },

  created() {
    this.timeoutId = 0;
    this.datasetArrays = {};
    this.initializeData('China');
  },

  methods: {
    async initializeData(area) {
      if (this.datasetArrays[area]) {
        return this.currentDatasetArr = this.datasetArrays[area];
      }

      const limit = 30;
      let page = 0;
      let more = true;
      let isFirstFetch = true;
      while (more) {
        // fetch data
        const rawData =
          await fetchJSON(`/countries/${area}/all`, {limit, page});

        if (this.dates) {
          // if this.dates exists, append the new data to it
          this.dates = [...this.dates, ...this.createDates(rawData)];
        } else {
          // initialize this.dates
          this.dates = this.createDates(rawData);
        }

        // normalize data
        const data = this.normalizeData(rawData);

        const thisArr = this.datasetArrays;
        // the data should be frozen to avoid reactivity in Vue
        if (thisArr[area]) {
          // if thisArr[area] exists, append the new data to it
          thisArr[area] = Object.freeze([...thisArr[area], ...data]);
        } else {
          // initialize thisArr[area]
          thisArr[area] = Object.freeze(data);
        }
        if (this.currentArea === area) {
          // render the first page of data at first
          if (isFirstFetch) {
            this.currentDatasetArr = thisArr[area];
            isFirstFetch = false;
          } else {
            this.updateCurrentDatasetArr(thisArr[area]);
          }
        }
        more = rawData.more;
        page++;
      }
    },

    updateCurrentDatasetArr(arr) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.currentDatasetArr = arr;
        this.timeoutId = 0;
      }, 500);
    },

    normalizeData(rawData) {
      const sources = [];
      for (const item of rawData.provinces) {
        const provinceData = item.data;
        provinceData.forEach((singleDayData, index, arr) => {
          // The data of two cruise ships, MS Zaandam and Diamond Princess
          // and the data of Holy See(VA) and Marshall Islands(MH)
          if (!(isoToCountry[item.iso] || isoToProvince[item.iso])) {
            return;
          }

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
          dimensions: this.dimensions,
          source
        };
      });
    },

    createDates(rawData) {
      return rawData.data.map((item) => item.Date);
    }
  }
};
</script>

<style scoped>
/*
#history {
  width: 100%;
  min-height: 80vh;
  display: flex;
}

@media screen and (min-aspect-ratio: 4/3) {
  #history {
    flex-flow: row wrap;
  }
}

@media not screen and (min-aspect-ratio: 4/3) {
  #history {
    flex-flow: column nowrap;
  }
}
*/

.columns {
  width: 100%;
}

.column {
  height: 80vh;
  box-sizing: border-box;
}

.header {
  width: 100%;
  height: 3.5rem;
  padding: 0 1.5rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
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
