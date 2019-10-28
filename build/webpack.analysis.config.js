const merge = require('webpack-merge')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const base = require('./webpack.client.config')

const config = env => merge(base(env), {
  plugins: [new BundleAnalyzerPlugin({ analyzerMode: 'static' })],
})

module.exports = config
