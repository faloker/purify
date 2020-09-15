// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
};

if (process.env.NODE_ENV === 'production') {
  const configureWebpack = {
    plugins: [
      // new BundleAnalyzerPlugin(),
    ],
    externals: {
      vue: 'Vue',
      lodash: '_',
      'vue-router': 'VueRouter',
      'vue-apexcharts': 'VueApexCharts',
      apexcharts: 'ApexCharts',
    },
  };
  config.configureWebpack = configureWebpack;
}

module.exports = config;
