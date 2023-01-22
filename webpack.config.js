const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

// Use host-relative requests by default for local serving (e.g., dev server).
let baseURL = null;
if (process.env.NETLIFY) {
  if (process.env.CONTEXT === 'production') {
    // For production deploys, use the site's main address as the base URL.
    // This always works, no matter if the site is requested on its main address or via a proxied address.
    // If the site is requested via a proxied request, assets will be loaded via the main address.
    baseURL = process.env.URL;
  } else {
    // In deploy previews or branch deploys, use the unique URL for an individual deploy.
    // With this, older deploys still work by using the correct base URL.
    baseURL = process.env.DEPLOY_URL;
  }
}

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    assetModuleFilename: '[name].[hash][ext][query]',
    clean: true
  },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  devServer: {},
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Testing reveal.js',
      meta: {
        'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      base: {
        href: baseURL
      },
      // in production mode, hash is included in output filename
      hash: devMode
    })
  ].concat(devMode ? [] : [new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css'
  })]),
  resolveLoader: {
    modules: ['node_modules', path.resolve('./loaders')]
  },
  module: {
    rules: [
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: 'asset/resource'
      },
      {
        test: /\.md$/,
        type: 'asset/resource',
        use: [
          'image-loader'
        ]
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
