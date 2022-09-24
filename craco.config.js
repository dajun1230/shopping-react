const CracoAntDesignPlugin = require('craco-antd');
const path = require("path");

const resolve = function(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#1890FF',
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@src': resolve('src')
    }
  }
};
