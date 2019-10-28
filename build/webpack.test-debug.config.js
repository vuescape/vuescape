const merge = require('webpack-merge')
const path = require('path')
const resolve = require('./resolve')

const index = resolve('test/test-loader.ts')

const base = require('./webpack.base.config')

const testConfig = env => {
  return {
    entry: `mocha-loader!${index}`,
    devServer: {
      host: 'localhost',
      port: '8081',
    },
    output: {
      filename: 'test.build.js',
      path: resolve('test'),
      publicPath: 'http://localhost:8081/',
    },
  }
}

const config = env => merge(base(env), testConfig(env), {})

module.exports = config
