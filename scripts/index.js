#!/usr/bin/env node

const command = ['build', 'dev', 'dll']

const argv = require('minimist')(process.argv.slice(2), {
  boolean: command,
  alias: {
    b: 'build',
	d: 'dev'
  },
  string: ['page']
})

console.log(argv)
