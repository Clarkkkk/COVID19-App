<template>
  <div id="app-menu">
    <div class="text-container">
      <span
        v-for="page in pages"
        :key="page.name"
        :class="['menu-item', {'active': currentPage === page.name}]"
        @click="onClick(page.name)"
      >
        {{ page.title }}
      </span>
    </div>
    <div class="indicator-container">
      <div
        :class="['indicator', {'moving': moving}]"
        ref="indicator"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      moving: false
    };
  },

  computed: {
    currentPage() {
      return this.$route.name;
    }
  },

  watch: {
    currentPage(newPage, oldPage) {
      this.$nextTick().then(() => {
        this.moveIndicator(newPage !== oldPage);
      });
    }
  },

  methods: {
    onClick(route) {
      if (route !== this.$route.name) {
        this.$router.push({name: route});
      }
    },

    moveIndicator(moving) {
      const index =
        this.pages.findIndex((page) => page.name === this.currentPage);
      const routeElem = document.querySelector('.menu-item');
      const indicator = this.$refs.indicator;
      // eslint-disable-next-line max-len
      const offset = routeElem.offsetWidth / 2 - indicator.offsetWidth / 2 + routeElem.offsetWidth * index;
      indicator.style = `transform: translateX(${offset}px)`;
      this.moving = moving;
    }
  },

  created() {
    this.pages = [
      {name: 'today', title: '今日疫情'},
      {name: 'history', title: '历史数据'},
      {name: 'links', title: '相关网站'}
    ];
  },

  mounted() {
    this.moveIndicator(false);
    this.$refs.indicator.addEventListener('animationend', () => {
      this.moving = false;
    });
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

#app-menu {
  height: 3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-container {
  flex: 1 1 2.5rem;
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: flex-start;
  font-size: $font-size-big;
  font-weight: bold;
  color: var(--app-text-color-in-dark);
  .menu-item {
    cursor: pointer;
    width: 6rem;
  }
}

@media not screen and (min-device-aspect-ratio: 3/4) {
  .text-container {
    justify-content: space-around;
  }
}

.indicator-container {
  flex: 1 1 1rem;
  width: 100%;
  height: 0.5rem;
  display: flex;
  align-items: flex-start;

  .indicator {
    height: 0.2rem;
    width: 1.5rem;
    border-radius: 0.2rem;;
    background-color: var(--app-text-color-in-dark);
  }

  .moving {
    animation: pull 300ms;
    transition: all 300ms;
  }
}

@keyframes pull {
  10% {
    width: 1.5rem;
  }
  40% {
    width: 3rem;
  }
  100% {
    width: 1.5rem;
  }
}
</style>
