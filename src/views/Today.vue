<template>
  <div id="today">
    <app-map />
  </div>
</template>

<script>
import AppMap from '@/components/AppMap';
export default {
  components: {
    AppMap
  }
};
</script>

<style scoped>
#today {
  width: 100%;
  min-height: 100vh;
}
</style>
