import Toasted from 'vue-toasted';
import Vue from 'vue';

export const ToastedService = {
  init() {
    Vue.use(Toasted, {
      duration: 3000,
      keepOnHover: true,
      theme: 'toasted-primary',
      iconPack: 'fontawesome',
      position: 'bottom-center',
    });

    Vue.toasted.register(
      'api_error',
      (err) => {
        if (err.response) {
          return err.response.data.message;
        }
        return 'Something went wrong..';
      },
      {
        type: 'error',
        icon: 'times',
      }
    );

    Vue.toasted.register('api_success', (payload) => payload.msg, {
      type: 'success',
      icon: 'check',
    });
  },
};
