<template>
  <div id="today">
    <div class="header">
      <span class="title">今日疫情</span>
      <a-select :default-value="selectGroup[0]" @change="onChange">
        <a-select-option v-for="option in selectGroup" :key="option">
          {{ option }}
        </a-select-option>
      </a-select>
    </div>
    <today-map
      :dataset="currentDataset"
      :area="currentArea"
    />
    <today-brief />
    <div class="graphs">
      <today-rate-rank
        :dataset="currentDataset"
      />
      <today-scatter
        :dataset="currentDataset"
      />
      <today-custom
        :dataset="currentDataset"
      />
    </div>
    <today-news class="news"/>
  </div>
</template>

<script>
import TodayMap from '@/components/TodayMap';
import TodayBrief from '@/components/TodayBrief';
import TodayRateRank from '@/components/TodayRateRank';
import TodayScatter from '@/components/TodayScatter';
import TodayCustom from '@/components/TodayCustom';
import TodayNews from '@/components/TodayNews';
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
      currentDataset: undefined,
      currentArea: 'China'
    };
  },

  components: {
    TodayMap,
    TodayBrief,
    TodayRateRank,
    TodayScatter,
    TodayCustom,
    TodayNews
  },

  methods: {
    // normalize the source data to a dataset
    normalizeData(rawData) {
      const source =[];
      for (const item of rawData) {
        source.push([
          isoToCountry[item.iso] || isoToProvince[item.iso],
          item.data.CurrentConfirmed,
          item.data.Confirmed,
          item.data.Recovered,
          item.data.Deaths,
          item.data.updateTime
        ]);
      }
      return {
        dimensions: ['地方名', '现存确诊', '累计确诊', '治愈', '死亡', '更新时间'],
        source: source
      };
    },

    onChange(value) {
      // the currentArea is used in series's map name
      if (value === '中国') {
        this.currentArea = 'China';
        this.currentDataset = this.datasets['China'];
      } else if (value === '世界') {
        this.currentArea = 'World';
        this.currentDataset = this.datasets['World'];
      }
    }
  },

  created() {
    // properties that don't need to be reactive
    this.datasets = {};
    // fetch and normalize data
    fetchJSON('/latest').then((res) => {
      this.datasets['World'] = this.normalizeData(res);
      for (const item of res) {
        if (item.country === 'China') {
          this.datasets['China'] = this.normalizeData(item.provinces);
        }
      }
      this.currentDataset = this.datasets['China'];
    });
  }
};
</script>

<style scoped>
#today {
  width: 100%;
  min-height: 80vh;
  display: flex;
}

@media screen and (min-aspect-ratio: 4/3) {
  #today {
    flex-flow: row wrap;
  }
}

@media not screen and (min-aspect-ratio: 4/3) {
  #today {
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

.news {
  flex: 1 1 40vw;
}

.ant-select {
  width: 80px;
}
</style>
