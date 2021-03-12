<template>
  <div id="app">
    <app-header />
    <transition :name="pageTransition" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
    <footer class="is-size-7">-&nbsp;&nbsp;&nbsp;&nbsp;&#32;&#32;由 <a href="mailto://clark1729@outlook.com">卡罗</a> 设计并开发 | 2021&nbsp;&nbsp;- </footer>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader';
export default {
  name: 'app',
  data() {
    return {
      pageTransition: ''
    };
  },
  watch: {
    '$route'(to, from) {
      const routes = ['today', 'history', 'links'];
      console.log(to);
      console.log(from);
      const toIndex = routes.indexOf(to.name);
      const fromIndex = routes.indexOf(from.name) || 0;
      this.pageTransition = fromIndex < toIndex ? 'left' : 'right';
    }
  },
  components: {
    AppHeader,
  }
};
</script>

<style lang='scss'>
$radius-extreme-large: 15px;
$input-radius: 10px;
.select {
  select {
    border-color: transparent !important;
  }
}

@import "bulma/sass/utilities/_all.sass";
@import "bulma/sass/form/shared.sass";
@import "bulma/sass/form/select.sass";
@import "bulma/sass/grid/_all.sass";
@import "bulma/sass/base/_all.sass";
@import "bulma/sass/helpers/typography.sass";


body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  --app-card-shadow: 0 0 12px #ededed;
  --app-card-radius: 15px;
  --app-color: #00a59d;
  --app-color-alpha: #00a59dd0;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.chart {
  height: 95vh;
}

#app > footer {
  height: 10rem;
  display: flex;
  align-items: center;
}

.left-enter-active, .left-leave-active, .right-enter-active, .right-leave-active {
  transition: transform 300ms, opacity 300ms;
}

.left-enter, .left-leave-to, .right-enter, .right-leave-to {
  opacity: 0;
}

.left-enter, .right-leave-to {
  transform: translateX(100vw);
}

.left-leave-to, .right-enter {
  transform: translateX(-100vw);
}
</style>
