<template>
  <div id="today-area-rank" class="covid-flex-item"></div>
</template>

<script>
export default {
  props: ['dataset', 'province'],
  created() {
    
  },
  watch: {
    dataset(newDataSet) {

    }
  }
};
</script>

<style scoped>
#today-area-rank {
  min-width: 40vw;
}
</style>
