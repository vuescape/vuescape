'use strict'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function getEnvironmentStyleLoader() {
  const environmentStyleLoader =
    process.env.NODE_ENV !== 'production'
      ? {
          loader: 'vue-style-loader',
          options: {
            sourceMap: false,
            shadowMode: false,
          },
        }
      : {
          loader: MiniCssExtractPlugin.loader,
        }

  return environmentStyleLoader
}

module.exports = getEnvironmentStyleLoader
