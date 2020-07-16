import { SHOW_MESSAGE } from '@/store/mutations';

export default {
  install(Vue, options) {
    Vue.prototype.$showMessage = function (type, text) {
      this.$store.commit(SHOW_MESSAGE, { text, type });
    };
  },
};
