<template>
  <div id="app-selector">
    <div class="selector">
      <button
        class="selector-option"
        v-for="option in options"
        :key="option"
        @click="onClick(option)"
      >
        {{ option }}
      </button>
      <div class="indicator" ref="indicator"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options', 'selected'],
  methods: {
    onClick(option) {
      const index = this.options.indexOf(option);
      const selectorOptionWidth = '4rem';
      this.$refs.indicator.style.transform =
        `translateX(calc(${selectorOptionWidth} * ${index}))`;
      this.$emit('update:selected', option);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "bulma/sass/utilities/controls.sass";
@import "bulma/sass/utilities/mixins";
@import '@/styles/variables';
$selector-option-width: 4rem;
$selector-option-height: 1.3rem;
$selector-padding: 2px;
$number: 2;

#app-selector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(2rem + #{$padding-small});
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

@include desktop {
  #app-selector {
    height: calc(2.5rem + #{$padding-normal});
  }
}

.selector {
  width: calc(#{$number * $selector-option-width} + #{$selector-padding * 2});
  height: calc(#{$selector-option-height} + #{$selector-padding * 2});
  padding: $selector-padding;
  box-sizing: border-box;
  background-color: var(--selector-background);
  display: flex;
  border-radius: 5px;
  position: relative;
  overflow: hidden;

  > .indicator {
    content: '';
    position: absolute;
    top: $selector-padding;
    left: $selector-padding;
    width: $selector-option-width;
    height: $selector-option-height;
    background-color: var(--selector-indicator);
    border-radius: 4px;
    box-shadow: 0 0 6px var(--shadow-color);
    z-index: 0;
    transition: transform 300ms;
  }

  > button.selector-option {
    @include control;
    @include control-small;
    padding: 0;
    width: $selector-option-width;
    height: $selector-option-height;
    line-height: $font-size-small;
    background-color: transparent;
    text-align: center;
    display: inline;
    font-size: $font-size-small;
    color: var(--app-text-color);
    z-index: 10;
  }
}

button {
  cursor: pointer;
  pointer-events: all;
}
</style>
