const path = require('path')
const merge = require('webpack-merge')

const resolve = require('./resolve')
const clientConfig = require('./webpack.client.config')

const hmrConfig = env => {
  const packageDirectory = resolve(`packages/${env.PACKAGE_NAME}`)

  return {
    output: {
      path: path.join(packageDirectory, 'dist'),
      publicPath: '/',
      filename: 'assets/js/[name].[hash].js',
    },
  }
}
module.exports = env => merge(clientConfig(env), hmrConfig(env), {})
