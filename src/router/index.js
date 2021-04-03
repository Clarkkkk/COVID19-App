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
    component: () => import(/* webpackChunkName: "page" */ '@/views/History.vue'),
  },
  {
    path: '/links',
    name: 'links',
    component: () => import(/* webpackChunkName: "page" */ '@/views/Links.vue'),
  }
];

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/covid19/',
});

router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  if (to.name && to.name === from.name) {
    return;
  }

  if (to.matched.length) {
    next();
  } else {
    next('/');
  }
});

export default router;
