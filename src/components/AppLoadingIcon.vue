<template>
  <div id="loading-spinner">
    <div class="spinner-icon">
      <div class="bar bar-one"></div>
      <div class="bar bar-two"></div>
      <div class="bar bar-three"></div>
      <div class="bar bar-four"></div>
      <div class="bar bar-five"></div>
      <div class="bar bar-six"></div>
      <div class="bar bar-seven"></div>
      <div class="bar bar-eight"></div>
      <div class="bar bar-nine"></div>
      <div class="bar bar-ten"></div>
      <div class="bar bar-eleven"></div>
      <div class="bar bar-twelve"></div>
    </div>
  </div>
</template>

<script>

</script>

<style>
#loading-spinner {
  width: 100%;
  height: calc(var(--basic-length) * 20);
  display: grid;
  place-items: center;
}
.spinner-icon {
  height: calc(var(--basic-length) * 20);
  width: calc(var(--basic-length) * 20);
  background-color: transparent;
  position: relative;
  --rotate-angle: 30deg;
  --basic-length: 1.1px;
  --frame-time: 80ms;
}

.bar {
  width: calc(var(--basic-length) * 5);
  height: var(--basic-length);
  background-color: #000000;
  border-radius: var(--basic-length);
  position: absolute;
  top: calc(var(--basic-length) * 10 - var(--basic-length) / 2);
  opacity: 0;
  transform-origin: calc(var(--basic-length) * 9) 50%;
  animation-name: loading-spinner;
  animation-duration: calc(var(--frame-time) * 12);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes loading-spinner {
  0% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
  }
}

.bar-two {
  animation-delay: calc(var(--frame-time) * 1);
  transform: rotate(calc(var(--rotate-angle) * 1));
}
.bar-three {
  animation-delay: calc(var(--frame-time) * 2);
  transform: rotate(calc(var(--rotate-angle) * 2));
}
.bar-four {
  animation-delay: calc(var(--frame-time) * 3);
  transform: rotate(calc(var(--rotate-angle) * 3));
}
.bar-five {
  animation-delay: calc(var(--frame-time) * 4);
  transform: rotate(calc(var(--rotate-angle) * 4));
}
.bar-six {
  animation-delay: calc(var(--frame-time) * 5);
  transform: rotate(calc(var(--rotate-angle) * 5));
}
.bar-seven {
  animation-delay: calc(var(--frame-time) * 6);
  transform: rotate(calc(var(--rotate-angle) * 6));
}
.bar-eight {
  animation-delay: calc(var(--frame-time) * 7);
  transform: rotate(calc(var(--rotate-angle) * 7));
}
.bar-nine {
  animation-delay: calc(var(--frame-time) * 8);
  transform: rotate(calc(var(--rotate-angle) * 8));
}
.bar-ten {
  animation-delay: calc(var(--frame-time) * 9);
  transform: rotate(calc(var(--rotate-angle) * 9));
}
.bar-eleven {
  animation-delay: calc(var(--frame-time) * 10);
  transform: rotate(calc(var(--rotate-angle) * 10));
}
.bar-twelve {
  animation-delay: calc(var(--frame-time) * 11);
  transform: rotate(calc(var(--rotate-angle) * 11));
}
</style>
