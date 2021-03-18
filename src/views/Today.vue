<template>
  <div id="today" class="tile is-ancestor is-vertical">
    <template v-if="dataAvailable">
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
          <today-custom
            :dataset="currentDataset"
            class="tile is-12 is-child chart"
          />
        </div>
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
      </div>
      <today-news class="news tile is-6 is-vertical is-parent"/>
    </div>
    </template>
    <app-loading-icon class="tile is-parent" v-else ref="map" />
  </div>
</template>

<script>
import {
  TodayMap,
  TodayBrief,
  TodayRateRank,
  TodayScatter,
  TodayCustom,
  TodayNews
} from '@/components/Today';
import {AppLoadingIcon} from '@/components/App';
import {
  isoCountryToEchartsName as isoToCountry,
  isoProvinceToEchartsName as isoToProvince,
  fetchJSON
} from '@/utils';
export default {
  data() {
    return {
      // eslint-disable-next-line max-len
      selectGroup: ['中国', '世界'],
      selected: '中国',
      currentArea: 'China',
      briefData: {},
      datasets: {},
      dataAvailable: false,
    };
  },

  computed: {
    /** @return { array } **/
    currentDataset() {
      return this.datasets[this.currentArea];
    },

    /** @return { object } **/
    currentBriefData() {
      return this.briefData[this.currentArea];
    },
  },

  components: {
    TodayMap,
    TodayBrief,
    TodayRateRank,
    TodayScatter,
    TodayCustom,
    TodayNews,
    AppLoadingIcon
  },

  watch: {
    selected(area) {
      // the currentArea is used in series's map name
      if (area === '中国') {
        this.currentArea = 'China';
      } else if (area === '世界') {
        this.currentArea = 'World';
      }
    }
  },

  created() {
    this.defaultDimensions = ['地方名', '现存确诊', '累计确诊', '治愈', '死亡', '更新时间'];
    // fetch and normalize data
    fetchJSON('/latest').then((res) => {
      this.datasets['World'] = this.createDataset(res);
      for (const item of res) {
        if (item.country === 'World') {
          this.briefData['World'] = this.createBriefData(item.data);
        } else if (item.country === 'China') {
          this.datasets['China'] = this.createDataset(item.provinces);
          this.briefData['China'] = this.createBriefData(item.data);
        }
      }
      this.dataAvailable = true;
    });
  },

  mounted() {
    console.log(this.$refs.map);
    this.$nextTick().then(() => console.log(this.$refs.map));
  },

  methods: {
    // normalize the source data to a dataset
    createDataset(rawData) {
      const source = [];
      for (const item of rawData) {
        if (item.country === 'World') {
          continue;
        }

        // The data of two cruise ships, MS Zaandam and Diamond Princess
        // and the data of Holy See(VA) and Marshall Islands(MH)
        if (!(isoToCountry[item.iso] || isoToProvince[item.iso])) {
          continue;
        }

        source.push([
          isoToCountry[item.iso] || isoToProvince[item.iso],
          item.data.CurrentConfirmed,
          item.data.Confirmed,
          item.data.Recovered,
          item.data.Deaths,
          item.data.updateTime
        ]);
      }
      // the dataset need not to be reactive
      return Object.freeze({
        dimensions: this.defaultDimensions,
        source: source
      });
    },

    createBriefData(rawData) {
      return Object.freeze(rawData);
    }
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
