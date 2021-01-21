<template>
  <div id="app-menu">
    <a-button class="collapse-button" @click="isHidden = !isHidden">
      <a-icon type="menu" />
    </a-button>
    <a-menu
      mode="inline"
      :inline-collapsed="isCollapse"
      :default-selected-keys="['item1']"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      :class="{'menu-hidden': isHidden}"
    >
      <a-menu-item key="item1">
        <a-icon type="calendar" />
        <span>今日疫情</span>
      </a-menu-item>
      <a-menu-item key="item2">
        <a-icon type="global" />
        <span>疫情地图</span>
      </a-menu-item>
      <a-menu-item key="item3">
        <a-icon type="read" />
        <span>疫情新闻</span>
      </a-menu-item>
    </a-menu>
    <footer :class="{'footer-hidden': isCollapse || isHidden}">
      <span>Made by Carlo</span>
      <span>2021</span>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      isHidden: false
    };
  },

  methods: {
    switchCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    onMouseEnter() {
      this.isCollapse = false;
    },

    onMouseLeave() {
      if (this.$root.deviceAspectRatio > (3/4)) {
        this.isCollapse = true;
      }
    }
  },

  created() {
    if (this.$root.deviceAspectRatio > (3/4)) {
      this.isCollapse = true;
      this.isHidden = false;
    } else {
      this.isCollapse = false;
      this.isHidden = true;
    }
    console.log(this.$root.deviceAspectRatio);
  }
};
</script>

<style scoped>
#app-menu {
  height: 100vh;
}

.ant-menu {
  box-sizing: border-box;
  height: 100%;
}

@media screen and (min-device-aspect-ratio: 3/4) {
  .ant-menu {
    transform: translateX(0);
    width: 10rem;
  }

  .ant-menu.ant-menu-inline-collapsed {
    width: 5rem;
  }

  .collapse-button {
    display: none;
  }
}

@media not screen and (min-device-aspect-ratio: 3/4) {
  .ant-menu {
    padding-top: 3rem;
    width: 100vw;
    transition: transform 300ms;
  }

  .menu-hidden {
    transform: translateX(-100vw);
  }

  .collapse-button {
    position: absolute;
    height: 2.5rem;
    width: 3.5rem;
    margin-left: 0.75rem;
    margin-top: 0.5rem;
    left: 0;
    top: 0;
    z-index: 10;
  }
}

footer {
  position: absolute;
  left: 0;
  bottom: 2rem;
  display: flex;
  flex-flow: column wrap;
  width: 10rem;
  height: 2.5rem;
  justify-content: space-around;
  align-content: center;
  font-size: 0.8rem;
  color: #aaa;
  transition: opacity 300ms 200ms;
  pointer-events: none;
}

footer.footer-hidden {
  opacity: 0;
  transition: opacity 300ms;
}
</style>
