import redirectComp from '../views/redirect';
import test from '@/views/test/index.vue';
export const config = [
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '入门与调试'
    },
    component: redirectComp,
    children: [
      {
        path: '/orbitControls',
        name: 'orbitControls',
        component: () => import('@/views/gettingStartedAndDebugging/orbitControls/index.vue'),
        meta: {
          title: '轨道控制器查看物体'
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
  },
  {
    path: '/test',
    name: 'test1',
    component: test,
    meta: {
      title: '测试1'
    }
  },
  {
    path: '/test',
    name: 'test2',
    component: test,
    meta: {
      title: '测试2'
    }
  },
  {
    path: '/keyframes',
    name: 'keyframes',
    component: () => import('@/views/animation/keyframes/index.vue'),
    meta: {
      title: 'keyframes'
    }
  }
];
