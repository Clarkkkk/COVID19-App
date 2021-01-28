import Vue from 'vue';
import VueRouter from 'vue-router';
import Today from '@/views/Today.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'today',
    component: Today
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/History.vue'),
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/views/Links.vue'),
  }
];

const router = new VueRouter({
  routes
});

export default router;
