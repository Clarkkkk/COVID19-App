<template>
  <div id="today" class="tile is-ancestor is-vertical">
    <div class="header tile is-parent">
        <span class="title">今日疫情</span>
        <div class="select">
          <select v-model="selected">
            <option v-for="option in selectGroup" :key="option">
              {{option}}
            </option>
          </select>
      </div>
    </div>

    <div class="tile">
      <today-map
        class="tile is-9 is-child is-parent chart"
        :dataset="currentDataset"
        :area="currentArea"
      />
      <today-brief
        class="tile is-vertical is-3"
        :data="currentBriefData"
      />
    </div>

    <div class="tile">
      <div class="graphs tile is-6 is-vertical">
        <div class="tile is-parent">
          <today-rate-rank
            :dataset="currentDataset"
            class="tile is-12 is-child chart"
          />
        </div>
        <div class="tile is-parent">
          <today-scatter
            :dataset="currentDataset"
            class="tile is-12 is-child chart"
          />
        </div>
        <div class="tile is-parent">
          <today-custom
            :dataset="currentDataset"
            class="tile is-12 is-child chart"
          />
        </div>
      </div>
      <today-news class="news tile is-6 is-vertical is-parent"/>
    </div>
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
      currentArea: 'China',
      briefData: {
        China: {},
        World: {}
      },
      selected: '中国'
    };
  },

  watch: {
    selected(area) {
      // the currentArea is used in series's map name
      if (area === '中国') {
        this.currentArea = 'China';
        this.currentDataset = this.datasets['China'];
      } else if (area === '世界') {
        this.currentArea = 'World';
        this.currentDataset = this.datasets['World'];
      }
    }
  },

  computed: {
    currentBriefData() {
      console.log(this.currentArea);
      console.log(this.briefData[this.currentArea]);
      return this.briefData[this.currentArea];
    }
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
      const source = [];
      console.log(rawData);
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
    }
  },

  created() {
    // properties that don't need to be reactive
    this.datasets = {};
    // fetch and normalize data
    fetchJSON('/latest').then((res) => {
      this.datasets['World'] = this.normalizeData(res);
      for (const item of res) {
        if (item.country === 'World') {
          this.briefData['World'] = item.data;
        } else if (item.country === 'China') {
          this.datasets['China'] = this.normalizeData(item.provinces);
          this.briefData['China'] = item.data;
        }
      }
      this.currentDataset = this.datasets['China'];
    });
  }
};
</script>

<style scoped>
/*
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
*/

#today {
  width: 100%;
}

.header {
  width: 100%;
  height: 5rem;
  flex: none;
  padding: 0.75rem 1.5rem;
  margin-top: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
}

.news {
  flex: 1 1 40vw;
}
</style>
