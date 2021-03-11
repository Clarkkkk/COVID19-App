import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

Vue.prototype.$log = function(...input) {
  if (process.env.NODE_ENV === 'development') {
    for (const entry of input) {
      console.log(entry);
    }
  }
};

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
