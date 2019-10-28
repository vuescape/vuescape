const ctx = require.context('../packages', true, /.+\.test\.ts$/)
ctx.keys().forEach(ctx)
module.exports = ctx
