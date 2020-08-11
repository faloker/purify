import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import VueApexCharts from 'vue-apexcharts';
import App from './App.vue';
import { router } from '@/router';
import store from '@/store';
import vuetify from '@/plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);
Vue.prototype.API_URL =
  process.env.NODE_ENV === 'production'
    ? // @ts-ignore
      window.DOMAIN
    : 'http://localhost:3000/api';

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
