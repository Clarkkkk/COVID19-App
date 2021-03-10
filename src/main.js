import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
  data: {
    deviceAspectRatio: 0
  },
  created() {
    this.deviceAspectRatio = window.screen.width / window.screen.height;
    console.log('device ratio aspect: ' + this.deviceAspectRatio);
  }
}).$mount('#app');
