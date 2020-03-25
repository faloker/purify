import Vue from 'vue';
import VuePageTransition from 'vue-page-transition';
import VueApexCharts from 'vue-apexcharts';
import { ToastedService } from '@/utils/toasted';
import App from './App.vue';
import { router } from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
ToastedService.init();
Vue.use(VuePageTransition);
Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
