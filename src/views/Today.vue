<template>
  <div id="today">
    <section class="map-and-brief">
      <today-map />
      <today-brief />
    </section>
    <section class="news">

    </section>
  </div>
</template>

<script>
import TodayMap from '@/components/TodayMap';
import TodayBrief from '@/components/TodayBrief';
export default {
  components: {
    TodayMap,
    TodayBrief
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
}

@media screen and (min-aspect-ratio: 4/3) {
  .map-and-brief {
    flex-flow: row nowrap;
  }
}

@media not screen and (min-aspect-ratio: 4/3) {
  .map-and-brief {
    flex-flow: column nowrap;
  }
}

@media not screen and (min-device-aspect-ratio: 3/4) {
  .map-and-brief {
    flex-flow: column nowrap;
    margin-top: 3rem;
  }
}
</style>
