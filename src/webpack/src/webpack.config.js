const webpack = require('webpack');
const path = require('path');
module.exports = {
  context: path.join(__dirname, 'app'),
  devtool: 'eval-source-map',
  entry: {
    vendor: [
      'react', 'react-dom'
    ],
    bundle: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?noInfo=false&path=http://127.0.0.1:3000/__webpack_hmr',
      './index.js'
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/js/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'react-hot-loader/webpack', 
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]&-autoprefixer',
          'postcss-loader',
          'sass-loader'
        ]
      }
		]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  watch: true,
  watchOptions: {
    poll: true
  }
};
