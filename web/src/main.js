import Vue from 'vue';
import VuePageTransition from 'vue-page-transition';
import App from './App.vue';
import { router } from './router';
import store from './store';
import ApiService from './common/api.service';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

ApiService.init();
Vue.use(VuePageTransition);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
