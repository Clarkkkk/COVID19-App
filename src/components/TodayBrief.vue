<template>
  <div id="today-brief">
    <span class="title">全国疫情概况</span>
    <span class="confirmed text">
      累计确诊：{{ data.confirmedCount }}（+{{ data.confirmedIncr }}）
    </span>
    <span class="current-confirmed text">
      现存确诊：{{ data.currentConfirmedCount }}（+{{ data.currentConfirmedIncr }}）
    </span>
    <span class="suspect text">
      疑似病例：{{ data.suspectedCount }}（+{{ data.suspectedIncr }}）
    </span>
    <span class="serious text">
      重症病例：{{ data.seriousCount }}（+{{ data.seriousIncr }}）
    </span>
    <span class="cured text">
      治愈：{{ data.curedCount }}（+{{ data.curedIncr }}）
    </span>
    <span class="dead text">
      死亡：{{ data.deadCount }}（+{{ data.deadIncr }}）
    </span>
    <span class="update-time text">
      更新时间：{{ (new Date(data.updateTime)).toLocaleString() }}
    </span>
  </div>
</template>

<script>
export default {
  created() {
    this.data = require('@/overall.json').results[0];
    console.log(this.data);
  }
};
</script>

<style scoped>
#today-brief {
  min-width: 20rem;
  min-height: 25rem;
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

.title {
  padding: 0 0 1rem;
  font-size: 2rem;
  font-weight: bold;
}

.text {
  padding: 0.2rem 0;
  font-size: 1rem;
  font-weight: bold;
}

.confirmed {
  color: #C62828;
}

.current-confirmed {
  color: #EF6C00;
}

.suspect {
  color: #F9A825;
}

.serious {
  color: #00695C;
}

.cured {
  color: #0277BD;
}

.dead {
  color: #283593;
}

.update-time {
  font-size: 0.8rem;
  font-weight: normal;
  color: #888;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
</style>
