import Vue from 'vue';
import Vuetify from 'vuetify/lib';
// import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        // primary: '#1a73e8',
        // secondary: '#045D56',
        // tertiary: '#FF6859',
        // quaternary: '#FF9100',
        // quinary: '#512DA8',
        // senary: '#0D47A1',
        primary: '#462255',
        secondary: '#313b72',
        tertiary: '#62a87c',
        quaternary: '#ffa400',
        quinary: '#009ffd',
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
