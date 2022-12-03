const path = require('path')

const getEnvironmentStyleLoader = require('./environmentStyleLoader')
const resolve = require('./resolve')

const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const config = env => {
  const packageDirectory = resolve(`.`)

  return {
    context: packageDirectory,
    module: {
      noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
      rules: [
        {
          test: /\.ts$/,
          exclude: /^\/node_modules\/.*$|.*\.(spec|test)\.ts$/,
          enforce: 'pre',
          use: [
            {
              loader: 'vue-tslint-loader',
              options: {
                configFile: './tslint.json',
                tsConfigFile: './tsconfig.json',
                emitErrors: true,
                failOnHint: true,
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          // exclude: /\.(spec|test)\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward',
              },
            },
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: ['\\.vue$'],
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                compilerOptions: {
                  preserveWhitespace: false,
                },
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|gif|png|webp)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'images/[name].[ext]',
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.(svg|svgz)(\?.*)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(ico|woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'fonts/[name].[ext]',
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          oneOf: [
            /* config.module.rule('css').oneOf('vue-modules') */
            {
              resourceQuery: /module/,
              use: [
                /* config.module.rule('css').oneOf('vue-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('css').oneOf('vue-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('css').oneOf('vue-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('css').oneOf('vue') */
            {
              resourceQuery: /\?vue/,
              use: [
                /* config.module.rule('css').oneOf('vue').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('css').oneOf('vue').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('css').oneOf('vue').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('css').oneOf('normal-modules') */
            {
              test: /\.module\.\w+$/,
              use: [
                /* config.module.rule('css').oneOf('normal-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('css').oneOf('normal-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('css').oneOf('normal-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('css').oneOf('normal') */
            {
              use: [
                /* config.module.rule('css').oneOf('normal').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('css').oneOf('normal').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('css').oneOf('normal').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
          ],
        },
        /* config.module.rule('postcss') */
        {
          test: /\.p(ost)?css$/,
          oneOf: [
            /* config.module.rule('postcss').oneOf('vue-modules') */
            {
              resourceQuery: /module/,
              use: [
                /* config.module.rule('postcss').oneOf('vue-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('postcss').oneOf('vue-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('postcss').oneOf('vue-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('postcss').oneOf('vue') */
            {
              resourceQuery: /\?vue/,
              use: [
                /* config.module.rule('postcss').oneOf('vue').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('postcss').oneOf('vue').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('postcss').oneOf('vue').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('postcss').oneOf('normal-modules') */
            {
              test: /\.module\.\w+$/,
              use: [
                /* config.module.rule('postcss').oneOf('normal-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('postcss').oneOf('normal-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('postcss').oneOf('normal-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('postcss').oneOf('normal') */
            {
              use: [
                /* config.module.rule('postcss').oneOf('normal').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('postcss').oneOf('normal').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('postcss').oneOf('normal').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
          ],
        },
        /* config.module.rule('scss') */
        {
          test: /\.scss$/,
          oneOf: [
            /* config.module.rule('scss').oneOf('vue-modules') */
            {
              resourceQuery: /module/,
              use: [
                /* config.module.rule('scss').oneOf('vue-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('scss').oneOf('vue-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('scss').oneOf('vue-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('scss').oneOf('vue-modules').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('scss').oneOf('vue') */
            {
              resourceQuery: /\?vue/,
              use: [
                /* config.module.rule('scss').oneOf('vue').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('scss').oneOf('vue').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('scss').oneOf('vue').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('scss').oneOf('vue').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('scss').oneOf('normal-modules') */
            {
              test: /\.module\.\w+$/,
              use: [
                /* config.module.rule('scss').oneOf('normal-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('scss').oneOf('normal-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('scss').oneOf('normal-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('scss').oneOf('normal-modules').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('scss').oneOf('normal') */
            {
              use: [
                /* config.module.rule('scss').oneOf('normal').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('scss').oneOf('normal').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('scss').oneOf('normal').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('scss').oneOf('normal').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
          ],
        },
        /* config.module.rule('sass') */
        {
          test: /\.sass$/,
          oneOf: [
            /* config.module.rule('sass').oneOf('vue-modules') */
            {
              resourceQuery: /module/,
              use: [
                /* config.module.rule('sass').oneOf('vue-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('sass').oneOf('vue-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('sass').oneOf('vue-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('sass').oneOf('vue-modules').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                    indentedSyntax: true,
                  },
                },
              ],
            },
            /* config.module.rule('sass').oneOf('vue') */
            {
              resourceQuery: /\?vue/,
              use: [
                /* config.module.rule('sass').oneOf('vue').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('sass').oneOf('vue').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('sass').oneOf('vue').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('sass').oneOf('vue').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                    indentedSyntax: true,
                  },
                },
              ],
            },
            /* config.module.rule('sass').oneOf('normal-modules') */
            {
              test: /\.module\.\w+$/,
              use: [
                /* config.module.rule('sass').oneOf('normal-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('sass').oneOf('normal-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('sass').oneOf('normal-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('sass').oneOf('normal-modules').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                    indentedSyntax: true,
                  },
                },
              ],
            },
            /* config.module.rule('sass').oneOf('normal') */
            {
              use: [
                /* config.module.rule('sass').oneOf('normal').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('sass').oneOf('normal').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('sass').oneOf('normal').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('sass').oneOf('normal').use('sass-loader') */
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: false,
                    indentedSyntax: true,
                  },
                },
              ],
            },
          ],
        },
        /* config.module.rule('less') */
        {
          test: /\.less$/,
          oneOf: [
            /* config.module.rule('less').oneOf('vue-modules') */
            {
              resourceQuery: /module/,
              use: [
                /* config.module.rule('less').oneOf('vue-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('less').oneOf('vue-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('less').oneOf('vue-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('less').oneOf('vue-modules').use('less-loader') */
                {
                  loader: 'less-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('less').oneOf('vue') */
            {
              resourceQuery: /\?vue/,
              use: [
                /* config.module.rule('less').oneOf('vue').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('less').oneOf('vue').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('less').oneOf('vue').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('less').oneOf('vue').use('less-loader') */
                {
                  loader: 'less-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('less').oneOf('normal-modules') */
            {
              test: /\.module\.\w+$/,
              use: [
                /* config.module.rule('less').oneOf('normal-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('less').oneOf('normal-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('less').oneOf('normal-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('less').oneOf('normal-modules').use('less-loader') */
                {
                  loader: 'less-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
            /* config.module.rule('less').oneOf('normal') */
            {
              use: [
                /* config.module.rule('less').oneOf('normal').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('less').oneOf('normal').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('less').oneOf('normal').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('less').oneOf('normal').use('less-loader') */
                {
                  loader: 'less-loader',
                  options: {
                    sourceMap: false,
                  },
                },
              ],
            },
          ],
        },
        /* config.module.rule('stylus') */
        {
          test: /\.styl(us)?$/,
          oneOf: [
            /* config.module.rule('stylus').oneOf('vue-modules') */
            {
              resourceQuery: /module/,
              use: [
                /* config.module.rule('stylus').oneOf('vue-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('stylus').oneOf('vue-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('stylus').oneOf('vue-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('stylus').oneOf('vue-modules').use('stylus-loader') */
                {
                  loader: 'stylus-loader',
                  options: {
                    sourceMap: false,
                    preferPathResolver: 'webpack',
                  },
                },
              ],
            },
            /* config.module.rule('stylus').oneOf('vue') */
            {
              resourceQuery: /\?vue/,
              use: [
                /* config.module.rule('stylus').oneOf('vue').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('stylus').oneOf('vue').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('stylus').oneOf('vue').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('stylus').oneOf('vue').use('stylus-loader') */
                {
                  loader: 'stylus-loader',
                  options: {
                    sourceMap: false,
                    preferPathResolver: 'webpack',
                  },
                },
              ],
            },
            /* config.module.rule('stylus').oneOf('normal-modules') */
            {
              test: /\.module\.\w+$/,
              use: [
                /* config.module.rule('stylus').oneOf('normal-modules').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('stylus').oneOf('normal-modules').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]',
                  },
                },
                /* config.module.rule('stylus').oneOf('normal-modules').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('stylus').oneOf('normal-modules').use('stylus-loader') */
                {
                  loader: 'stylus-loader',
                  options: {
                    sourceMap: false,
                    preferPathResolver: 'webpack',
                  },
                },
              ],
            },
            /* config.module.rule('stylus').oneOf('normal') */
            {
              use: [
                /* config.module.rule('stylus').oneOf('normal').use('vue-style-loader') */
                getEnvironmentStyleLoader(),
                /* config.module.rule('stylus').oneOf('normal').use('css-loader') */
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    importLoaders: 2,
                  },
                },
                /* config.module.rule('stylus').oneOf('normal').use('postcss-loader') */
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: false,
                  },
                },
                /* config.module.rule('stylus').oneOf('normal').use('stylus-loader') */
                {
                  loader: 'stylus-loader',
                  options: {
                    sourceMap: false,
                    preferPathResolver: 'webpack',
                  },
                },
              ],
            },
          ],
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
          options: {
            rootMode: 'upward',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.runtime.esm.js',
        '@vuescape': path.join(packageDirectory, 'src'),
      },
    },
    devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : false,
    devServer: {
      contentBase: path.join(packageDirectory, 'dist'),
    },
    plugins: [
      new VueLoaderPlugin(),
      // new webpack.NoEmitOnErrorsPlugin(),
      new CaseSensitivePathsPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
    node: {
      setImmediate: false,
      process: 'mock',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  }
}
module.exports = config
