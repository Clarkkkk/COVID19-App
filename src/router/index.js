import Vue from 'vue';
import VueRouter from 'vue-router';
import Today from '@/views/Today.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Today
  },
];

const router = new VueRouter({
  routes
});

export default router;
