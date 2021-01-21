<template>
  <div id="app">
    <app-menu />
    <router-view />
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu';
export default {
  name: 'app',
  components: {
    AppMenu,
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-size: 16px;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}
</style>
