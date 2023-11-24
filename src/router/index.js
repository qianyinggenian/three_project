import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';
import layout from '../views/layout';
import { config } from '@/router/config';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'layout',
    component: layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: layout,
        meta: {
          title: '首页'
        }
      },
      ...config
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
});

export default router;
