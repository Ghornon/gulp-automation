#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const fs = require('fs');
const path = require('path');
const mkdir = require('./modules/Directories.js');
const Logger = require('./modules/Logger.js');
const { Workspace, Projects } = require('./modules/config.js');
const shell = require('shelljs');

const create = (answers) => {
	
	Logger.info('Creating new project...');
	
	if (Projects.add(answers))
		mkdir.make(Projects.find(answers.name));
	
};

const select = (answers) => {
	
	const current = answers.project;
	
	Workspace.set(Projects.find(current));
	
};

const remove = (answers) => {
	
	const current = answers.project;
	
	Projects.remove(Projects.find(current));
	
};

const run = () => {

	shell.exec('gulp default');

};

/* Create prompt */

program
	.command('create')
	.alias('c')
	.description('Create new project')
	.action(() => {
		prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Project name:'
			},
			{
				type: 'input',
				name: 'dirName',
				message: 'Project directory name:'
			},
			{
				type: 'input',
				name: 'sourcesFile',
				message: 'Project sources file name:',
				default: 'default.json'
			}
		]).then(answers => create(answers));
	});

/* Select prompt */

program
	.command('select')
	.alias('s')
	.description('Select project')
	.action(() => {
		prompt({
			type: 'list',
			name: 'project',
			message: 'Select project:',
			choices: Projects.get().map((element) => {
				return element.name
			}),
			default: Workspace.getIndex()
		}).then(answers => select(answers));
	});

/* Remove prompt */

program
	.command('remove')
	.alias('r')
	.description('Edit project')
	.action(() => {
		prompt({
			type: 'list',
			name: 'project',
			message: 'Select project to remove:',
			choices: Projects.get().map((element) => {
				return element.name
			})
		}).then(answers => remove(answers));
	});

/* Run prompt */

program
	.command('run')
	.description('Run project')
	.action(run);

program.parse(process.argv);
	
	
