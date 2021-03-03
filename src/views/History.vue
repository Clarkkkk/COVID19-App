<template>
  <div id="history">
    <div class="header">
      <span class="title">历史数据</span>
      <div class="select">
        <select :default-value="selectGroup[0]" @change="onChange">
          <option v-for="option in selectGroup" :key="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <history-map
      :area="currentArea"
      :datasetArr="currentDatasetArr"
      :dates="dates"
    />
    <history-area-rank
      :area="currentArea"
      :datasetArr="currentDatasetArr"
      :dates="dates"
    />
  </div>
</template>

<script>
import HistoryMap from '@/components/HistoryMap';
import HistoryAreaRank from '@/components/HistoryAreaRank';
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
      currentArea: '',
      currentDatasetArr: [],
      dates: []
    };
  },

  components: {
    HistoryMap,
    HistoryAreaRank
  },

  created() {
    this.datasetArrays = {};
    this.currentArea = 'China';
    this.initializeData('China');
  },

  methods: {
    async initializeData(area) {
      const limit = 30;
      let page = 0;
      let more = true;
      while (more) {
        // fetch data
        const rawData = await fetchJSON('/countries/' + area, {limit, page});

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
          this.currentDatasetArr = thisArr[area];
        }
        more = false;
        //more = rawData.more;
        page++;
      }
    },

    normalizeData(rawData) {
      const sources = [];
      for (const item of rawData.provinces) {
        const provinceData = item.data;
        provinceData.forEach((singleDayData, index, arr) => {
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
          dimensions: ['地方名', '现存确诊', '累计确诊', '治愈', '死亡',
            '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡', '日期'],
          source
        };
      });
    },

    createDates(rawData) {
      return rawData.data.map((item) => item.Date);
    },

    onChange(value) {
      // the currentArea is used in series's map name
      if (value === '中国') {
        this.currentArea = 'China';
        this.currentDatasetArr = this.datasetArrays['China'];
      } else if (value === '世界') {
        this.currentArea = 'World';
        if (this.datasetArrays['World']) {
          this.currentDatasetArr = this.datasetArrays['World'];
        } else {
          this.initializeData('World');
        }
      }
    }
  }
};
</script>

<style scoped>
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

.header {
  width: 100%;
  height: 3.5rem;
  padding: 0 1.5rem;
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
