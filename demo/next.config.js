const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(new WebpackBundleSizeAnalyzerPlugin('stats.txt'));
    }

    return config;
  }
}
