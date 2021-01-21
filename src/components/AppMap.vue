<template>
  <div id="app-map">
  </div>
</template>

<script>
import fetchJSON from '@/functions/fetchJSON';
import '@/assets/china.js';
export default {
  data() {
    return {
      chinaData: [],
      globalData: []
    };
  },

  methods: {
    createMap() {
      const echarts = require('echarts');
      this.map = echarts.init(this.$el);
      this.map.setOption({
        series: [{
          type: 'map',
          map: 'china',
          selectMode: 'multiple',
          top: 0,
          bottom: 0,
          aspectScale: 0.77,
          label: {
            show: true,
            fontSize: 14,
            color: '#444',
          },
          itemStyle: {
            borderColor: '#aaa'
          },
          emphasis: {
            label: {
              textShadowColor: '#888',
              textShadowBlur: 2
            },
            itemStyle: {
              shadowColor: '#aaa',
              shadowBlur: 10
            }
          }
        }]
      });
    },

    updateMap(option) {

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
  },

  mounted() {
    this.createMap();
  }
};
</script>

<style scoped>
#app-map {
  border: 1px solid;
  width: 100%;
  height: 50%;
}
</style>
