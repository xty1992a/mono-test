#!/usr/bin/env node

const program = require("commander");

program.version("1.0.0")
	.usage("<command> [项目名称]")
	.command("pack <mode> [pages]", "构建")
	.parse(process.argv);
