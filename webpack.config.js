const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    assetModuleFilename: '[name].[hash][ext][query]',
    clean: true
  },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  devServer: {
    static: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Testing reveal.js',
      meta: {
        'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      // TODO: add base path
      // 'base': 'http://example.com/some/page.html',
      // in production mode, hash is included in output filename
      hash: devMode
    })
  ].concat(devMode ? [] : [new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css'
  })]),
  module: {
    rules: [
      {
        test: /\.md$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    minimizer: [
      `...`,
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
