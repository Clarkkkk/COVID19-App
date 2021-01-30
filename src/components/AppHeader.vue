<template>
  <div id="app-header">
    <div class="title-container">
      <span class="title">COVID-19疫情信息小站</span>
      <span class="sub-title">
        由 <a href="mailto://clark1729@outlook.com">卡罗</a> 设计并开发 | 2021
      </span>
    </div>
    <div class="menu-container" ref="menu">
      <transition name="header">
        <app-menu class="menu" v-if="showMenu"/>
        <div class="page-title" v-else>{{ currentPage }}</div>
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
    },

    view() {
      return this.showMenu ? AppMenu : this.pageTitle;
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

.title-container {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  z-index: 10;
  height: 6.5rem;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  background-color: var(--app-color);
  color: white;
  letter-spacing: 0.5px;
}

.title {
  font-size: 1.7rem;
  font-weight: bold;
}

.sub-title {
  color: #eee;
  font-size: 0.8rem;
}

.sub-title > a, a:link, a:visited {
  color: #eee;
  border-bottom: solid 1px #eee;
}

.menu-container {
  position: sticky;
  top: 0;
  height: 3rem;
  width: 100%;
  background-color: var(--app-color);
  z-index: 10000;
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: white;
  width: 6rem;
}

.header-enter, .header-leave-to {
  opacity: 0;
}

.page-title.header-enter, .page-title.header-leave-to {
  transform: translateY(3rem);
}

.menu.header-enter, .menu.header-leave-to {
  transform: translateY(-3rem);
}

.header-enter-active, .header-leave-active {
  transition: all 300ms;
}

.header-leave-active {
  position: absolute;
}
</style>
