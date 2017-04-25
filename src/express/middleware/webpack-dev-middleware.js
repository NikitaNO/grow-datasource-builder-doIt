const path = require('path');
const express = require('express');
const app = express();
if (process.env.NODE_ENV === 'development') {
  const webpack       = require('webpack');
  const webpackConfig = require(path.join(__dirname, '..', '..', 'webpack', 'src', 'webpack.config.js'));
  const compiler      = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}
module.exports = app;
