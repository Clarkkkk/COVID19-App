<template>
  <div id="history">
    <div class="header">
      <span class="title">历史数据</span>
      <select :default-value="selectGroup[0]" @change="onChange">
        <option v-for="option in selectGroup" :key="option">
          {{ option }}
        </option>
      </select>
    </div>
    <history-map
      :area="currentArea"
      :datasetArr="currentDatasetArr"
      :dates="dates"
    />
  </div>
</template>

<script>
import HistoryMap from '@/components/HistoryMap';
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
    HistoryMap
  },

  created() {
    this.datasetArrays = {};
    this.fetchData('China', 20);
    this.currentArea = 'China';
    this.currentDatasetArr = this.datasetArrays['China'];
  },

  methods: {
    fetchData(area, limit, page = 0) {
      return fetchJSON('/countries/' + area, {limit, page}).then((res) => {
        console.log(res);
        if (this.datasetArrays[area]) {
          this.datasetArrays[area] = Object.freeze([
            ...this.datasetArrays[area],
            ...this.normalizeData(res)
          ]);
        } else {
          this.datasetArrays[area] = Object.freeze(this.normalizeData(res));
        }
        this.dates = this.createDates(res);
        if (this.currentArea === area) {
          this.currentDatasetArr = this.datasetArrays[area];
        }
        if (res.more) {
          return this.fetchData(area, limit, page + 1);
        }
      });
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
            singleDayData.updateTime
          ]);
        });
      }
      return sources.map((source) => {
        return {
          dimensions: ['地方名', '现存确诊', '累计确诊', '治愈', '死亡',
            '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡', '更新时间'],
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
        this.currentDatasetArr = this.datasetArrays['World'];
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
