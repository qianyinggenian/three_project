import redirectComp from '../views/redirect';
import digital from '@/views/digital/index.vue';
// import test from '@/views/test/index.vue';
import wangEditor from '@/views/wangEditor/index.vue';
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
    path: '/digital',
    name: 'digital',
    component: digital,
    meta: {
      title: '南中项目'
    }
  },
  {
    path: '/wangEditor',
    name: 'wangEditor',
    component: wangEditor,
    meta: {
      title: 'wangEditor'
    }
  },
  {
    path: '/keyframes',
    name: 'keyframes',
    component: () => import('@/views/animation/keyframes/index.vue'),
    meta: {
      title: 'keyframes'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      title: 'test'
    }
  },
  {
    path: '/three',
    name: 'three',
    component: () => import('@/views/three/gltfView.vue'),
    meta: {
      title: 'gltfView'
    }
  },
  {
    path: '/ifcView',
    name: 'ifcView',
    component: () => import('@/views/three/ifcView.vue'),
    meta: {
      title: 'ifcView'
    }
  }
];
