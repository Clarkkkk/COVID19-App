<template>
  <div id="today-brief">
    <div class="tile is-parent">
      <div class="content confirmed">
        <div class="category">累计确诊</div>
        <div class="count">{{ data.Confirmed || '-' }}</div>
        <div class="comment">新增 {{ data.ConfirmedIncr }} 人</div>
      </div>
    </div>

    <div class="tile is-parent" ref="map">
      <div class="content recovered">
        <div class="category">治愈</div>
        <div class="count">{{ data.Recovered || '-' }}</div>
        <div class="comment">新增 {{ data.RecoveredIncr }} 人</div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="content deaths">
        <div class="category">死亡</div>
        <div class="count">{{ data.Deaths || '-' }}</div>
        <div class="comment">新增 {{ data.DeathsIncr }} 人</div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="content deaths">
        <div class="category">疫苗接种剂次</div>
        <div class="count">{{ vaccineData[this.area].total || '-' }}</div>
        <div class="comment">日均 {{ vaccineData[this.area].daily }} 剂</div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="content current">
        <div class="category">实时预估</div>
        <div class="count">{{ currentConfirmedCount }}</div>
        <div class="comment">{{ confirmedRateStr }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const ONE_DAY_SECONDS = 24 * 60 * 60;
import {fetchJSON} from '@/utils';
export default {
  props: ['data', 'area'],
  data() {
    return {
      currentDeathsCount: 0,
      currentConfirmedCount: 0,
      confirmedRate: 0,
      vaccineData: {
        China: {},
        World: {}
      }
    };
  },

  computed: {
    /** @return { string } **/
    confirmedRateStr() {
      const incr = this.data.ConfirmedIncr;
      if (incr / (ONE_DAY_SECONDS) < 1) {
        const confirmedRate = ((ONE_DAY_SECONDS) / incr).toFixed(0);
        return `平均每 ${confirmedRate} 秒有 1 人确诊`;
      } else {
        const confirmedRate = (incr / (ONE_DAY_SECONDS)).toFixed(1);
        return `平均每秒有 ${confirmedRate} 人确诊`;
      }
    }
  },

  methods: {
    getPassedRatio() {
      const now = new Date(Date.now());
      const todayStartUTC = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      );
      // getTimezoneOffset() is really weird!
      // In UTC+8, it returns -480. Yes, in minutes, and negative...
      const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
      const todayStartLocal = todayStartUTC + timezoneOffsetMs;
      return (Date.now() - todayStartLocal) / (ONE_DAY_SECONDS * 1000);
    }
  },

  created() {
    setInterval(() => {
      const passedTime = this.getPassedRatio();
      this.currentConfirmedCount =
        (this.data.Confirmed + this.data.ConfirmedIncr * passedTime).toFixed(1);
    }, 50);

    fetchJSON('/vaccine/latest').then((res) => {
      for (const item of res) {
        if (item.country === 'World') {
          this.vaccineData['World'] = Object.freeze(item.data);
        } else if (item.country === 'China') {
          this.vaccineData['China'] = Object.freeze(item.data);
        }
      }
      console.log(this.vaccineData);
    });
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/extends';
@media not screen and  (min-aspect-ratio: 4/3) {
   #today-brief {
     display: flex;
     flex-flow: row wrap;
     align-items: flex-start;
   }

   #today-brief > tile {
     flex: 1 1 auto;
   }
}

.content {
  @extend %container;
  @extend %full-size;
  padding: 1rem 1.5rem;
  color: #fff;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: center;
  background-color: var(--container-background-color);

  > .count {
    font-weight: bold;
    font-size: $font-size-biggest;
    color: var(--app-color);
  }

  > .category {
    color: var(--app-sub-text-color);
    font-size: $font-size-small;
    font-weight: bold;
  }

  > .comment {
    color: var(--app-sub-text-color);
    font-size: $font-size-small;
    white-space: nowrap;
  }
}
</style>
