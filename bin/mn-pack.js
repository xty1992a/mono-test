#!/usr/bin/env node
const program = require('commander');
const entries = require('../scripts/entries');
const utils = require('../scripts/utils');

program
	.option('-d, --dev', 'pack mode development')
	.option('-b, --build', 'pack mode production')
	.parse(process.argv);

console.log(program.build)

entries(utils.packages('.'))
	.then(res => {
	  console.log(res)
	})



