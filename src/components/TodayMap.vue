<template>
  <div id="today-map" class="covid-flex-item">
    <div class="map" ref="map"></div>
    <a-select
      :default-value="selectGroup[0]"
      @change="onChange"
    >
      <a-select-option
        v-for="option in selectGroup"
        :key="option"
      >
        {{ option }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import fetchJSON from '@/utils/fetchJSON';
import mapHelper from '@/utils/mapHelper.js';
export default {
  data() {
    return {
      selectGroup: ['中国', '世界', '河北', '北京', '天津', '陕西', '吉林', '辽宁', '广西', '广东', '湖北', '黑龙江', '山东', '山西', '上海', '香港', '台湾', '浙江', '河南', '福建', '内蒙古', '四川', '云南', '湖南', '重庆', '甘肃', '新疆', '安徽', '海南', '江苏', '贵州', '宁夏', '青海', '江西', '西藏', '澳门'],
      currentDataSet: []
    };
  },

  methods: {
    // normalize the source data to a dataset
    normalizeData(sourceData, isProvinceData) {
      // names of data to get
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

    createSeriesOption(mapName) {
      const series = [];
      // for dimensionNames used in legend, create relavant series
      const dimensionNames = [
        '现存确诊',
        '累计确诊',
        '治愈',
        '死亡'
      ];
      for (let i = 0; i < dimensionNames.length; i++) {
        const option = mapHelper.createBasicOption('series');
        option.map = mapName;
        option.name = dimensionNames[i];
        series.push(option);
      }
      return series;
    },

    onChange(value) {
      if (value === '中国') {
        this.switchMap('china', this.chinaDataSet);
      } else if (value === '世界') {
        this.switchMap('world', this.worldDataSet);
      } else {
        // province map
        // find the province's data
        const provinceData =
          this.chinaData.find((entry) => entry.provinceShortName === value);
        const provinceDataSet = this.normalizeData(provinceData, true);
        this.switchMap(value, provinceDataSet);
      }
    },

    switchMap(province, dataset) {
      const series = this.createSeriesOption(province);
      const option = {
        series: series,
        dataset: dataset
      };
      mapHelper.updateMap(option, province, this.map);
    }
  },

  created() {
    // properties that don't need to be reactive
    this.chinaData;
    this.chinaDataSet;
    this.worldDataSet;
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
      this.chinaData = chinaData;
      // normalizeData
      this.chinaDataSet = this.normalizeData(chinaData);
      this.worldDataSet = this.normalizeData(worldData);
      console.log(this.chinaDataSet);
      const province = this.chinaDataSet.source.map((item) => {
        return item[0];
      });
      console.log(province);
      // create map after mounted
      return this.$nextTick();
    }).then(() => {
      const series = this.createSeriesOption('china');
      this.map = mapHelper.createMap(this.$refs.map, {
        title: {
          text: '实时疫情地图'
        },
        series: series,
        dataset: this.chinaDataSet
      });
    });
  },
};
</script>

<style scoped>
#today-map {
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  position: relative;
  min-width: 80vw;
  height: 80vw;
}

@media screen and (min-aspect-ratio: 4/3) {
  #today-map {
    min-width: 60vw;
    height: 40vw;
  }
}

.map {
  width: 100%;
  height: 100%;
}

.ant-select {
  pointer-events: auto;
  width: 80px;
  position: absolute;
  top: 10px;
  right: 140px;
}
</style>
