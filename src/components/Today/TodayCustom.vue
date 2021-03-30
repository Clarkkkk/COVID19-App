<template>
  <app-chart-container
    id="today-custom"
    :fullscreen="fullscreen"
  >
    <div ref="canvas" class="canvas"></div>
    <app-selector :options="['柱状图', '饼图']" :selected.sync="selected" />
  </app-chart-container>
</template>

<script>
import {CustomChart} from '@/charts';
import {AppChartContainer, AppSelector} from '@/components/App';
export default {
  data() {
    return {
      chartType: 'bar',
      fullscreen: {value: false},
      selected: '柱状图'
    };
  },
  props: ['dataset'],
  components: {
    AppChartContainer,
    AppSelector
  },

  created() {
    this.chart;
    this.dimensions = ['地方名', '现存确诊', '累计确诊', '治愈', '死亡',
      '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡', '更新时间'];
    this.$nextTick().then(() => this.initializeChart());
  },

  activated() {
    this.chart.activated();
  },

  deactivated() {
    this.chart.deactivated();
  },

  watch: {
    dataset(newDataset) {
      this.chart.update({dataset: newDataset});
    },

    selected(type) {
      if (type === '柱状图') {
        this.chart && this.chart.switchType('bar');
      } else if (type === '饼图') {
        this.chart && this.chart.switchType('pie');
      }
    }
  },

  methods: {
    initializeChart() {
      const dataset = [
        this.dataset,
        ...this.createTransforms(['现存确诊', '累计确诊', '治愈', '死亡',
          '新增现存确诊', '新增累计确诊', '新增治愈', '新增死亡', ])
      ];
      const option = {
        title: {text: '{underline|各地数据}'},
        dataset
      };
      const config = {
        dimensions: this.dimensions,
        fullscreen: this.fullscreen,
        priority: 8,
        chartTypes: [{
          name: 'bar',
          config: {isVertical: false, isInverse: true}
        }, {
          name: 'pie',
        }]
      };
      this.chart = new CustomChart(this.$refs.canvas, option, config);
    },

    createTransforms(legendDimensions) {
      return legendDimensions.map((dimension) => {
        return {
          id: dimension,
          transform: {
            type: 'sort',
            config: {
              dimension,
              order: 'desc'
            }
          }
        };
      });
    }
  }
};
</script>

<style lang="scss">
#today-custom {
  position: relative;
}
</style>
