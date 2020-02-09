import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset';

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        primary: '#1EB980',
        secondary: '#045D56',
        tertiary: '#FF6859',
        quaternary: '#FFCF44',
        quinary: '#B15DFF',
        senary: '#72DEFF',
      },
    },
    dark: true,
  },
  icons: {
    iconfont: 'mdi',
  },
});
