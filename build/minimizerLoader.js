'use strict'
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function getMinimizerLoaders() {
  const uglifyLoader =
    process.env.NODE_ENV !== 'production'
      ? []
      : [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // set to true if you want JS source maps
            uglifyOptions: {
              compress: {
                // pure_funcs: ['console.log'],
              },
            },
          }),
          new OptimizeCSSAssetsPlugin({}),
        ]

  return uglifyLoader
}

module.exports = getMinimizerLoaders
