import redirectComp from '../views/redirect';
import test from '@/views/test/index.vue';
export const config = [
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '基础设置'
    },
    component: redirectComp,
    children: [
      {
        path: '/keyframes',
        name: 'keyframes',
        component: () => import('@/views/animation/keyframes/index.vue'),
        meta: {
          title: '导航设置'
        }
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: test,
    meta: {
      title: '测试'
    }
  }
];
