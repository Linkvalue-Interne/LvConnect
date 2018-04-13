const config = require('config');
const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './index.jsx',
  context: path.resolve(__dirname, './'),
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]-[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ttf|svg|woff)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash].[ext]',
          },
        },
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true },
        },
        exclude: /node_modules/,
      },
    ],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServer: {
    historyApiFallback: true,
    overlay: true,
    progress: true,
    proxy: [{
      context: ['/oauth', '/users'],
      target: 'http://localhost:8000',
    }],
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new DefinePlugin({
      'process.env.APP_CONFIG': JSON.stringify(config.front),
    }),
  ],
};
