import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = true;
Vue.prototype.$_store = store;
Vue.use(ElementUI);
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
