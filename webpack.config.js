const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const isProd = process.env.NODE_ENV === 'production';

function resolve (dir) {
  return path.resolve(__dirname, '..', dir);
}

module.exports = {
  entry: {
    app: './src/index.ts'
  },
  output: {
    path: resolve('public'),
    filename: '[name].[contenthash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        // include: [resolve('src')],
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ]
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".ts", ".tsx", ".mjs"],
  },
  devtool: isProd ? 'cheap-module-source-map' : 'eval-cheap-source-map',
  plugins: [
    new VueLoaderPlugin(),
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    host: 'localhost', // 主机名
    // stats: 'errors-only', // 打包日志输出输出错误信息
    port: 8591,
    // open: true
  },
};
