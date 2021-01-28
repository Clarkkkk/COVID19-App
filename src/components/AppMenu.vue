<template>
  <div id="app-menu">
    <span
      v-for="page in pages"
      :key="page.name"
      :class="['menu-item', {'active': currentPage === page.name}]"
      @click="onClick(page.name)"
    >
      {{ page.title }}
    </span>
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
      console.log(oldPage);
      this.$nextTick().then(() => {
        this.moveIndicator(newPage);
      });
    }
  },

  methods: {
    onClick(route) {
      console.log(route);
      this.$router.push({name: route});
    },

    moveIndicator(moving) {
      const routeElem =
        document.querySelector('.menu-item.active') ||
        document.querySelector('.menu-item');
      const indicator = this.$refs.indicator;
      // eslint-disable-next-line max-len
      const offset = routeElem.offsetLeft + routeElem.offsetWidth / 2 - indicator.offsetWidth / 2;
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

<style scoped>
#app-menu {
  height: 2.8rem;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--app-color);
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: white;
}

@media not screen and (min-device-aspect-ratio: 3/4) {
  #app-menu {
    justify-content: space-around;
  }
}

.menu-item {
  cursor: pointer;
  width: 6rem;
}

.indicator-container {
  width: 100%;
  height: 0.5rem;
  position: absolute;
  left: 0;
  top: 2.2rem;
  display: flex;
  align-items: flex-start;
}

.indicator {
  height: 0.2rem;
  width: 1.5rem;
  border-radius: 0.2rem;;
  background-color: white;
}

.moving {
  animation: pull 300ms;
  transition: all 300ms;
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
