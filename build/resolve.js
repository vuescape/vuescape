'use strict'

const path = require('path')

function resolve(directory) {
  const resovledPath = path.join(__dirname, '../', directory)
   return resovledPath
}

module.exports = resolve
