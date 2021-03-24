<template>
  <div id="app">
    <app-header />
    <transition :name="pageTransition" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
    <footer> -&nbsp;&nbsp;&nbsp;&nbsp;&#32;&#32;由 <a href="mailto://clark1729@outlook.com">卡罗</a> 设计并开发 | 2021&nbsp;&nbsp;- </footer>
  </div>
</template>

<script>
import {AppHeader} from '@/components/App';
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
@import './styles/global';
@import './styles/mixins';

#app {
  font-family: Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart {
  height: 95vh;
}

#app > footer {
  height: 10rem;
  display: flex;
  align-items: center;
  color: var(--app-sub-text-color);
  font-size: $font-size-small;
}

:root, :root * {
  @include scrollbar;
}

@mixin slide($dir) {
  $factor: 1;
  @if $dir!=left {
    $factor: -1;
  }

  @include active;
  @include enter {
    opacity: 0;
    transform: translateX($factor * 100vw);
  }
  @include leave-to {
    opacity: 0;
    transform: translateX($factor * (-100vw));
  }
}

.left {
  @include slide('left');
}

.right {
  @include slide('right');
}

.container {
  @include active;
  @include enter {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
