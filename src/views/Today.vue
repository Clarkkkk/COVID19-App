<template>
  <div id="today">
    <today-map />
    <today-brief />
    <today-news />
  </div>
</template>

<script>
import TodayMap from '@/components/TodayMap';
import TodayBrief from '@/components/TodayBrief';
import TodayNews from '@/components/TodayNews';
export default {
  components: {
    TodayMap,
    TodayBrief,
    TodayNews
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

@media not screen and (min-device-aspect-ratio: 3/4) {
  #today {
    flex-flow: column nowrap;
    margin-top: 3rem;
  }
}
</style>
