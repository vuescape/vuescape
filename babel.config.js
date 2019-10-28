module.exports = function(api) {
  api.cache(true)
  return {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
        },
      ],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
        },
      ],
      ['transform-remove-console', { "exclude": [ "error", "warn", "info", "debug", "trace"] }],
    ],
    ignore: ['node_modules/*'],
  }
}
