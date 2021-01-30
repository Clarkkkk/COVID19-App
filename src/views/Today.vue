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
      :dataset="currentDataSet"
      :province="currentProvince"
    />
    <today-brief />
    <today-area-rank
      :dataset="currentDataSet"
      :province="currentProvince"
    />
    <today-news />
  </div>
</template>

<script>
import TodayMap from '@/components/TodayMap';
import TodayBrief from '@/components/TodayBrief';
import TodayAreaRank from '@/components/TodayAreaRank';
import TodayNews from '@/components/TodayNews';
import fetchJSON from '@/utils/fetchJSON';
export default {
  data() {
    return {
      // eslint-disable-next-line max-len
      selectGroup: ['中国', '世界', '河北', '北京', '天津', '陕西', '吉林', '辽宁', '广西', '广东', '湖北', '黑龙江', '山东', '山西', '上海', '香港', '台湾', '浙江', '河南', '福建', '内蒙古', '四川', '云南', '湖南', '重庆', '甘肃', '新疆', '安徽', '海南', '江苏', '贵州', '宁夏', '青海', '江西', '西藏', '澳门'],
      currentDataSet: undefined,
      currentProvince: 'china'
    };
  },

  components: {
    TodayMap,
    TodayBrief,
    TodayAreaRank,
    TodayNews
  },

  methods: {
    // normalize the source data to a dataset
    normalizeData(sourceData, isProvinceData) {
      // names of data to get for both province data and china/world data
      const dataNames = [
        'currentConfirmedCount',
        'confirmedCount',
        'curedCount',
        'deadCount'
      ];

      const source = [];

      if (isProvinceData) {
        dataNames.unshift('cityName');
        const cities = sourceData.cities;
        const provinceName = sourceData.provinceShortName;
        // cities use their province's update time
        const updateTime = sourceData.updateTime;
        // echarts' province map requires suffix
        const suffix = /北京|天津|上海|重庆/.test(provinceName) ? '区' : '市';
        for (const data of cities) {
          const arr = dataNames.map((dataName) => {
            if (dataName === 'cityName') {
              return data[dataName] + suffix;
            } else {
              return data[dataName];
            }
          });
          arr.push(updateTime);
          source.push(arr);
        }
      } else {
        // china/world data
        dataNames.unshift('provinceShortName');
        dataNames.push('updateTime');
        for (const data of sourceData) {
          const arr = dataNames.map((dataName) => data[dataName]);
          source.push(arr);
        }
      }
      return {
        dimensions: [
          '地方名',
          '现存确诊',
          '累计确诊',
          '治愈',
          '死亡',
          '更新时间'
        ],
        source: source
      };
    },

    onChange(value) {
      // the currentProvince is used in series's map name
      if (value === '中国') {
        this.currentProvince = 'china';
        this.currentDataSet = this.allDataSets.chinaDataSet;
      } else if (value === '世界') {
        this.currentProvince = 'world';
        this.currentDataSet = this.allDataSets.worldDataSet;
      } else {
        this.currentProvince = value;
        this.currentDataSet = this.allDataSets[value + 'DataSet'];
      }
    }
  },

  created() {
    // properties that don't need to be reactive
    this.allDataSets = {};
    // fetch and normalize data
    fetchJSON('', '/data/area.json').then((data) => {
      console.log(data);
      // the area data consists of china's and the world's
      const chinaData = [];
      const worldData = [];
      for (const entry of data.results) {
        if (entry.countryName === entry.provinceName) {
          worldData.push(entry);
        } else if (entry.countryName === '中国') {
          chinaData.push(entry);
        } else {
          console.log('else data: ' + entry);
        }
      }
      // normalize dataset of china, world, and all provinces
      this.allDataSets.chinaDataSet = this.normalizeData(chinaData);
      this.allDataSets.worldDataSet = this.normalizeData(worldData);
      for (const provinceData of chinaData) {
        // the provinceShortName is in Chinese
        const propertyName = provinceData.provinceShortName + 'DataSet';
        this.allDataSets[propertyName] =
          this.normalizeData(provinceData, true);
      }
      console.log(this.allDataSets);
      this.currentDataSet = this.allDataSets.chinaDataSet;
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

.ant-select {
  width: 80px;
}
</style>
