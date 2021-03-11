<template>
  <div id="app-header">
    <div class="app-title-container">
      <span class="app-title">COVID-19疫情信息小站</span>
      <span class="app-sub-title">
        疫情数据每天下午2:00更新 | 新闻每小时更新
        <br>
        数据来源：<a href="https://github.com/datasets/covid-19" target="_blank" rel="noopener">datahub.io</a>、<a href="https://t.me/nCoV2019" target="_blank" rel="noopener">@nCoV2019 telegram频道</a>
      </span>
    </div>
    <div class="app-menu-container" ref="menu">
      <transition name="header">
        <app-menu class="app-menu" v-if="showMenu"/>
        <div class="app-page-title" v-else>{{ currentPage }}</div>
      </transition>
    </div>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu';
export default {
  components: {
    AppMenu
  },

  data() {
    return {
      showMenu: true
    };
  },

  computed: {
    currentPage() {
      const pages = {
        today: '今日疫情',
        history: '历史数据',
        links: '相关网站'
      };
      return pages[this.$route.name];
    }
  },

  mounted() {
    const menu = this.$refs.menu;
    this.originalTop = menu.offsetTop;
    this.lastTop = menu.offsetTop;
    this.reversalTop = menu.offsetTop;
    this.dir = '';

    // when the menu is stick to top,
    // if scroll down for some distance, replace the menu with the page title
    // if scroll up for some distance, show the menu instead
    window.addEventListener('scroll', (evevt) => {
      const offsetTop = menu.offsetTop;
      const currentDir = offsetTop > this.lastTop ? 'down' : 'up';
      this.lastTop = offsetTop;

      // Not stick to top yet, return
      if (offsetTop === this.originalTop) {
        return;
      }

      // if the scroll direction remains the same, and reveralTop is 0
      // nothing needs to be changed
      if (this.dir === currentDir && !this.reversalTop) {
        return;
      }

      // if the scroll direction changes, set reveralTop and this.dir
      if (this.dir !== currentDir) {
        this.reversalTop = offsetTop;
        this.dir = currentDir;
      // Assert: this.dir === currentDir && this.reversalTop !== 0
      // reveralTop is set in the last scroll direction change
      // but the showMenu is not set accordingly yet
      } else if (Math.abs(offsetTop - this.reversalTop) > 20) {
        // switch the header when scrolling distance exceeds 20px
        // set the reversalTop to 0 to indicate that the header does not
        // need to change until the scroll direction changes again
        this.showMenu = this.reversalTop - offsetTop > 0;
        this.reversalTop = 0;
        console.log(this.showMenu);
      }
    });
  }
};
</script>

<style scoped>
/* Use inline or contents(if supported) to avoid being the scrolling container */
#app-header {
  display: inline;
  display: contents;
}

.app-title-container {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  z-index: 10;
  height: 7.5rem;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  background-color: var(--app-color-alpha);
  color: white;
  letter-spacing: 0.5px;
}

.app-title {
  font-size: 1.7rem;
  white-space: nowrap;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.app-sub-title {
  font-size: 0.8rem;
  text-align: start;
}

.app-sub-title > a, a:link, a:visited {
  color: #fff;
  border-bottom: solid 1px #fff;
}

.app-menu-container {
  position: sticky;
  top: 0;
  height: 3rem;
  width: 100%;
  background-color: var(--app-color-alpha);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
}

.app-page-title {
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: white;
  width: 6rem;
}

.header-enter, .header-leave-to {
  opacity: 0;
}

.app-page-title.header-enter, .app-page-title.header-leave-to {
  transform: translateY(3rem);
}

.app-menu.header-enter, .app-menu.header-leave-to {
  transform: translateY(-3rem);
}

.header-enter-active, .header-leave-active {
  transition: all 300ms;
}

.header-leave-active {
  position: absolute;
}
</style>
