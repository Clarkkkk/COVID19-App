<template>
  <div class="app-chart-container">
    <div :class="['fullscreen-background', {'fullscreen': fullscreen.value}]"></div>
    <div class="animated-box" ref="animated">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['fullscreen'],
  watch: {
    fullscreen: {
      handler: function(obj) {
        console.log(obj.value);
        if (obj.value) {
          const animated = this.$refs.animated;
          const rect = animated.getBoundingClientRect();
          animated.classList.add('fullscreen');
          animated.style = `
            width: ${rect.right - rect.left}px;
            height: ${rect.bottom - rect.top}px;
            transform: translate(${rect.left}px, ${rect.top}px);
          `;

          this._flush = document.body.offsetHeight;
          animated.classList.add('expand');
          animated.addEventListener('animationend', () => {
            animated.style = '';
            animated.classList.remove('expand');
          });
        } else {
          const animated = this.$refs.animated;
          const rect = this.$el.getBoundingClientRect();
          animated.classList.remove('fullscreen');
          animated.style = `
            transform: translate(${-rect.left}px, ${-rect.top}px);
          `;

          this._flush = document.body.offsetHeight;
          animated.classList.add('restore');
          animated.addEventListener('animationend', () => {
            animated.style = '';
            animated.classList.remove('restore');
          });
        }
      },
      deep: true
    },
  }
};
</script>

<style scoped>
.fullscreen-background {
  width: 90vw;
  height: 90vw;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  background-color: #00000090;
  backdrop-filter: blur(10px);
  pointer-events: none;
  transition: opacity 300ms;
}

.fullscreen-background.fullscreen {
  opacity: 1;
}

.animated-box {
  height: 100%;
  width: 100%;
  box-shadow: var(--app-card-shadow);
  border-radius: var(--app-card-radius);
  background-color: white;
  overflow: hidden;
}

.animated-box.fullscreen {
  position: fixed;
  z-index: 20000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.animated-box.expand {
  animation: expand 1000ms;
}

@keyframes expand {
  40% {
    transform: translate(0px, -10px);
  }

  60% {
    width: 100vw;
    height: 100vh;
  }

  100% {
    width: 100vw;
    height: 100vh;
    transform: translate(0px, 0px);
    border-radius: 0;
  }
}

.animated-box.restore {
  z-index: 20000;
  position: relative;
  animation: restore 1000ms;
}

@keyframes restore {
  0% {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }

  100% {
    transform: translate(0px, 0px);
  }
}


</style>
