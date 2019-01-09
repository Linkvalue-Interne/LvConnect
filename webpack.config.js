const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './index.jsx',
  context: path.resolve(__dirname, './packages/app/'),
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: process.env.NODE_ENV !== 'dev' ? '/' : 'http://localhost:8080/',
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      cache: true,
      parallel: true,
    })],
    splitChunks: {
      name: 'vendors',
      chunks: 'all',
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(ttf|woff|woff2)$/,
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
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        use: { loader: 'url-loader', options: { limit: 1, name: '[path][name]-[hash].[ext]' } },
      },
    ],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    overlay: true,
    progress: true,
    proxy: [{
      context: ['/oauth', '/users', '/login', '/forgot-password', '/reset-password', '/old', '/mdl', '/apps'],
      target: 'http://localhost:8000',
    }],
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new DefinePlugin({
      'process.env.APP_ENV': `"${process.env.APP_ENV || 'dev'}"`,
    }),
  ],
};
