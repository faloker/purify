import Vue from 'vue';
import VuePageTransition from 'vue-page-transition';
import VueApexCharts from 'vue-apexcharts';
import App from './App.vue';
import { router } from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Notifier from './plugins/notifier';

Vue.config.productionTip = false;
Vue.use(VuePageTransition);
Vue.use(VueApexCharts);
Vue.use(Notifier);

Vue.component('apexchart', VueApexCharts);

Vue.prototype.API_URL =
  process.env.NODE_ENV === 'production' ? window.DOMAIN : 'http://localhost:3000/api';

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
