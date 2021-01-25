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
  --app-card-shadow: 0 0 5px #ccc;
  --app-card-radius: 5px;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
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
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  position: relative;
  margin: 0.5rem;
}

@media screen and (min-aspect-ratio: 4/3) {
  .covid-flex-item {
    margin: 1.5rem;
  }
}
</style>
