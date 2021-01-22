<template>
  <div id="today">
    <section class="map-and-brief">
      <app-map
        :mapOption="mapOption"
      />
      <today-brief />
    </section>
    <section class="news">

    </section>
  </div>
</template>

<script>
import AppMap from '@/components/AppMap';
import TodayBrief from '@/components/TodayBrief';
export default {
  data() {
    return {
      globalData: [],
      chinaData: [],
      mapOption: {}
    };
  },

  components: {
    AppMap,
    TodayBrief
  },

  methods: {
    normalizeData(sourceData) {
      const source = [];
      const dataNames = [
        'provinceShortName',
        'currentConfirmedCount',
        'confirmedCount',
        'curedCount',
        'deadCount',
        'updateTime'
      ];
      const dimensions = [
        '省份',
        '现存确诊',
        '累计确诊',
        '治愈',
        '死亡',
        '更新时间'
      ];
      for (const data of sourceData) {
        const arr = [];
        for (const dataName of dataNames) {
          arr.push(data[dataName]);
        }
        source.push(arr);
      }
      return {
        dataset: {
          dimensions: dimensions,
          source: source
        }
      };
    }
  },

  created() {
    this.data = require('@/area.json');
    console.log(this.data);
    for (const data of this.data.results) {
      if (data.countryName === data.provinceName) {
        this.globalData.push(data);
        if (data.countryName === '中国') {
          console.log(data);
        }
      } else if (data.countryName === '中国') {
        this.chinaData.push(data);
      } else {
        console.log('else data: ' + data);
      }
    }

    console.log(this.chinaData);
    this.mapOption = this.normalizeData(this.chinaData);
    console.log(this.mapOption);
  }
};
</script>

<style scoped>
#today {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

.map-and-brief {
  display: flex;
  gap: 1rem;
}

@media screen and (min-aspect-ratio: 4/3) {
  .map-and-brief {
    flex-flow: row nowrap;
    padding: 2rem;
  }
}

@media not screen and (min-aspect-ratio: 4/3) {
  .map-and-brief {
    flex-flow: column nowrap;
    padding: 0.5rem;
  }
}


</style>
