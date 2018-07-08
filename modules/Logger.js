/* eslint no-console: "off" */

'use strict';

const chalk  = require('chalk');

const Logger =  {
	
	chalk: chalk,

	success: (msg) => {
		console.log(chalk.green.bold('[OK]'), msg);
	},
	
	error: (msg) => {
		console.error(chalk.red('[Error]'), msg);
	},
	
	warning: (msg) => {
		console.log(chalk.yellow.bold('[Warnign]'), msg);
	},
	
	info: (msg) => {
		console.log(chalk.blue.bold('[Info]'), msg);
	}
	
};

module.exports = Logger;