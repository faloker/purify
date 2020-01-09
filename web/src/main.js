import Vue from 'vue';
import VuePageTransition from 'vue-page-transition'
import _ from 'lodash';
import '@mdi/font/css/materialdesignicons.css';
// import Toasted from 'vue-toasted';
// import Vuetify from 'vuetify';
import App from './App.vue';
import { router } from './router';
import store from './store';
import ApiService from './common/api.service';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.prototype._ = _;

ApiService.init();
// Vue.use(Vuetify);
// Vue.use(Toasted);
Vue.use(VuePageTransition);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
