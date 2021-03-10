<template>
  <div id="today-brief">
    <div class="tile is-parent">
      <div class="content confirmed">
        <div class="category">累计确诊</div>
        <div class="count">{{ data.Confirmed }}</div>
        <div class="comment">新增 {{ data.ConfirmedIncr }} 人</div>
      </div>
    </div>

    <div class="tile is-parent">
      <div class="content recovered">
        <div class="category">治愈</div>
        <div class="count">{{ data.Recovered }}</div>
        <div class="comment">新增 {{ data.RecoveredIncr }} 人</div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="content deaths">
        <div class="category">死亡</div>
        <div class="count">{{ data.Deaths }}</div>
        <div class="comment">新增 {{ data.DeathsIncr }} 人</div>
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
export default {
  props: ['data'],
  data() {
    return {
      currentDeathsCount: 0,
      currentConfirmedCount: 0,
      confirmedRate: 0
    };
  },

  computed: {
    confirmedRateStr() {
      const incr = this.data.ConfirmedIncr;
      if (incr / (24 * 60 * 60) < 1) {
        const confirmedRate = ((24 * 60 * 60) / incr).toFixed(0);
        return `平均每 ${confirmedRate} 秒有 1 人确诊`;
      } else {
        const confirmedRate = (incr / (24 * 60 * 60)).toFixed(1);
        return `平均每秒有 ${confirmedRate} 人确诊`;
      }
    }
  },

  created() {
    const now = new Date(Date.now());
    let today = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    today = today - (new Date(today)).getHours() * 60 * 60 * 1000;
    setInterval(() => {
      const passedTime = (Date.now() - today) / (24 * 60 * 60 * 1000);
      console.log((new Date(today)).getHours());
      this.currentConfirmedCount =
        (this.data.Confirmed + this.data.ConfirmedIncr * passedTime).toFixed(1);
    }, 50);
  }
};
</script>

<style scoped>
/*
#today-brief {
  min-width: 18rem;
  min-height: 22rem;
  flex: 1 1 18rem;
  padding: 2rem;
  box-sizing: border-box;
  color: #222;
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  align-items: end;
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
}
*/

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
  width: 100%;
  height: 100%;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
  background: white;
  color: #fff;
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: center;
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
}

.count {
  font-weight: bold;
  font-size: 2rem;
  color: var(--app-color);
}

.category {
  color: #666;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.comment {
  color: #666;
  font-size: 0.8rem;
  white-space: nowrap;
}

.title {
  padding: 0 0 1rem;
  font-size: 2rem;
  font-weight: bold;
}
</style>
