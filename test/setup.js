require('jsdom-global')()

// from @vue/cli-plugin-unit-mocha/setup.js
// require('jsdom-global')(undefined, { pretendToBeVisual: true, url: 'http://localhost' })
// https://github.com/vuejs/vue-test-utils/issues/936
// better fix for "TypeError: Super expression must either be null or
// a function" than pinning an old version of prettier.
window.Date = Date

// Ultimate hack to suppress Vue warnings about Vuetify:
// '[Vuetify] Multiple instances of Vue detected'
// which clutters test output and makes it very hard to read
// See https://github.com/vuetifyjs/vuetify/issues/4068 for discussion and variety of
// solutions that did not work
// Also using this to suppress other warnings that are cluttering test output
const logError = console.error
console.error = (...args) => {
  if (args[0].includes('[Vuetify]') && args[0].includes('https://github.com/vuetifyjs/vuetify/issues/4068')) {
    return
  }

  if (args[0].includes('[Vue warn]') && args[0].includes('Unknown custom element:')) {
    return
  }

  if (args[0].includes('[vuex]') && args[0].includes('module namespace not found in mapState(): appInfo/')) {
    return
  }

  logError(...args)
}
