<template>
  <div id="app">
    <app-header />
    <router-view />
    <footer>由 <a href="mailto://clark1729@outlook.com">卡罗</a> 设计并开发 | 2021</footer>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader';
export default {
  name: 'app',
  components: {
    AppHeader,
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  --app-card-shadow: 0 0 3px #ccc;
  --app-card-radius: 15px;
  --app-color: #00a59d;
  --app-color-alpha: #00a59dd0;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fafafa;
  position: relative;
}

/* global scrollbar style */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc;    /* color of the scroll thumb */
  border-radius: 8px;       /* roundness of the scroll thumb */
  border: 2px solid #fff;  /* creates padding around scroll thumb */
}

:root, body * {
  scrollbar-width: thin;          /* "auto" or "thin" */
  scrollbar-color: #ccc #fff;   /* scroll thumb and track */
}

/* flex-item's universal style */
.covid-flex-item {
  position: relative;
  margin: 0.5rem;
  background-color: #fff;
}

@media screen and (min-aspect-ratio: 4/3) {
  .covid-flex-item {
    margin: 15px;
  }
}
</style>
