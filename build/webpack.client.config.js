const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const getMinimizerLoaders = require('./minimizerLoader')
const resolve = require('./resolve')

const base = require('./webpack.base.config')

const clientConfig = env => {
  const packageDirectory = '.'

  const outputPath = resolve(path.join(packageDirectory, 'dist'))
  console.info(outputPath)
  return {
    entry: {
      app: resolve(path.join(packageDirectory, 'src', 'index.ts')),
    },
    output: {
      path: outputPath,
      filename: 'vuescape.js',
      library: 'vuescape',
      libraryTarget: 'umd',
    },
    optimization: {
      minimizer: getMinimizerLoaders(),
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },

    plugins: [
      new VuetifyLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'vuescape.css',
      }),
      new CopyWebpackPlugin([]),
    ],
  }

  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        publicPath: 'http://localhost:9999/',
        filename: '[file].map',
      }),
    )
  }

  return config
}

module.exports = env => merge(base(env), clientConfig(env), {})
