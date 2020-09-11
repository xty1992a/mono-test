#!/usr/bin/env node
const program = require('commander');
const entries = require('../scripts/build/entries');
const build = require('../scripts/build/index');
const utils = require('../scripts/utils');

program
	.option('-d, --dev', 'pack mode development')
	.option('-b, --build', 'pack mode production')
	.parse(process.argv);

if(program.build) {
  process.env.NODE_ENV = 'production'
} else if(program.dev) {
  process.env.NODE_ENV = 'development'
}

console.log(program.build)

entries(utils.packages('.'))
	.then(res => {
	  build({
		mode: process.env.NODE_ENV,

	  })
	  console.log(res)
	})



