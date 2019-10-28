const merge = require('webpack-merge')

const base = require('./webpack.base.config')

const testConfig = env => {
  return {
    devtool: 'inline-cheap-module-source-map',
    output: {
      // ...
      // use absolute paths in sourcemaps (important for debugging via IDE)
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
    },
  }
}

const config = env => merge(base(env), testConfig(env), {})

module.exports = config
