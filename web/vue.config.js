const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
};

if (process.env.NODE_ENV === 'production') {
  const configureWebpack = {
    plugins: [
      new MomentLocalesPlugin(),
    // new BundleAnalyzerPlugin(),
    ],
    externals: {
      vue: 'Vue',
      lodash: '_',
      'vue-toasted': 'Toasted',
      'vue-router': 'VueRouter',
      'vue-simplemde': 'VueSimpleMDE',
      'vue-apexcharts': 'VueApexCharts',
      apexcharts: 'ApexCharts',
    },
  };
  config.configureWebpack = configureWebpack;
}

module.exports = config;
