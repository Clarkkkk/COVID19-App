<template>
  <div id="today-area-rank" class="covid-flex-item"></div>
</template>

<script>
export default {
  props: ['dataset', 'province'],
  custom: {
    a: 1
  },
  created() {
    console.log(this.$options.custom);
  },
  watch: {
    dataset(newDataSet) {

    }
  }
};
</script>

<style scoped>

</style>
