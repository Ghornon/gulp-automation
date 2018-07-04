#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const Logger = require('./modules/Logger.js');
const { Structures, Workspace, Project } = require('./modules/config.js');
const Interface = require('./modules/Interface.js');
const Directories = require('./modules/Directories.js');
const shell = require('shelljs');
const chalk = require('chalk');

const run = () => {

	shell.exec('gulp default');

};

class Chooser {

	constructor(name, message, choices = []) {

		this.name = name;
		this.message = message;
		this.choices = [];

		const IChoices = new Interface('IChoices', [], ['label', 'callback']);
		
		for (let i = 0; i < choices.length; i++) {

			const currentMember = choices[i];

			IChoices.isImplementedBy(currentMember);
			this.choices.push(currentMember);

		}

	}

	action() {
		
		const name = this.name;
		const message = this.message;
		const choices = this.choices;
		const self = this;

		return () => {

			prompt({
	
				type: 'list',
				name: name,
				message: message,
				choices: choices.map((element) => {
					return element.label;
				})
		
			}).then((answares) => {
				
				const obj = choices.find((element) => {
					return answares[name] == element.label;
				});

				const callback = obj.callback;

				if (self[callback] && typeof self[callback] === 'function')
					self[callback]();
		
			});
	
		};

	}

	confirm(message, callback) {

		prompt({
		
			type: 'confirm',
			name: 'confirm',
			message: message
			
		}).then((answers) => {

			if (answers.confirm)
				if (callback && typeof callback === 'function')
					callback();

		});	

	}

}

class ProjectPrompt extends Chooser {

	constructor(name, message, choices) {
		super(name, message, choices);
	}

	select() {

		prompt({
		
			type: 'list',
			name: 'select',
			message: 'Select project:',
			choices: Project.projects.map((element) => {
				
				return element.name;
				
			}),
			default: Workspace.getName()
			
		}).then((answers) => {
			
			const current = answers.select;
	
			Workspace.set(Project.findIndex(current));
			
		});

	}

	init() {

		prompt({
		
			type: 'list',
			name: 'select',
			message: 'Select project to initiate a project directory structure:',
			choices: Project.projects.map((element) => {
				
				return element.name;
				
			})
			
		}).then((answers) => {
	
			Directories.make(Project.findIndex(answers.name));
			
		});

	}

	create() {

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
				name: 'structureFile',
				message: 'Project structure file name:',
				default: 'default.json'
			},
			{
				type: 'confirm',
				name: 'bundler',
				message: 'Do you want create a bundle file on output?'
			}

		]).then((answers) => {

			Logger.info('Creating new project...');

			const self = this;

			const callback = () => {
				self.confirm('Do you want to init a project directories structure?', () => 
					Directories.make(Project.findIndex(answers.name)));
			};

			console.log(JSON.stringify(answers, null, 4));

			Project.add(answers, callback);

		});

	}

	edit() {

		prompt({
		
			type: 'list',
			name: 'select',
			message: 'Select project to edit:',
			choices: Project.projects.map((element) => {
				
				return element.name;
				
			}),
			default: Workspace.name
			
		}).then((answers) => {

			const index = Project.findIndex(answers.select);
			const current = Project.get(index);

			prompt([

				{
					type: 'input',
					name: 'name',
					message: 'Project name:',
					default: current.name
				},
				{
					type: 'input',
					name: 'dirName',
					message: 'Project directory name:',
					default: current.dirName
				},
				{
					type: 'input',
					name: 'structureFile',
					message: 'Project structures file name:',
					default: current.structureFile
				},
				{
					type: 'confirm',
					name: 'bundler',
					message: 'Do you want create a bundle file on output?',
					default: current.bundler
				}
	
			]).then((answers) => {

				Logger.info('Editing project...');

				console.log(JSON.stringify(answers, null, 4));

				const callback = () => {
					self.confirm('Do you want to again into a project directory structure?', () => 
						Directories.make(Project.findIndex(answers.name)));
				};

				Project.edit(index, answers, callback);
	
			});
			
		});

	}

	remove() {

		prompt({
			
			type: 'list',
			name: 'project',
			message: 'Select project to remove:',
			choices: Project.projects.map((element) => {
				
				return element.name;
				
			})
			
		}).then((answers) => {
			
			const current = answers.project;
			
			this.confirm('Are you sure you want to delete the project?', () => {
				Logger.info('Removing project...');
				Project.remove(Project.findIndex(current));
			});
			
		});

	}

}

class StructurePromp extends Chooser {

	constructor(name, message, choices) {
		super(name, message, choices);
	}

	list() {

		const files = Structures.list();
		const usedFiles = Project.projects.map((element)=>{
			return element.structuresFile;
		});

		console.log('\n',chalk.cyan.bold("Used by the application"), '\t', "Not used");
		console.log("-----------------------------------------\n");

		for (let i = 0; i < files.length; i++) {

			const type = usedFiles.filter((element) => {
				return element == files[i];
			});

			if (type.length != 0) {
				console.log(i + 1 + ') ' + chalk.cyan.bold(files[i]));
			} else {
				console.log(i + 1 + ') ' + files[i]);
			}

		}

		console.log('\n');

	}

}

// Project

const project = new ProjectPrompt('Project', 'What do you want to do with the project?', [

	{
		label: 'Select project',
		callback: 'select'
	},
	{
		label: 'Init project',
		callback: 'init'
	},
	{
		label: 'Create new project',
		callback: 'create'
	},
	{
		label: 'Edit project',
		callback: 'edit'
	},
	{
		label: 'Remove project ',
		callback: 'remove'
	}

]);

// Structures

const structure = new StructurePromp('Structures', 'What do you want to do with the structures files?', [{
	label: 'List structure files names',
	callback: 'list'
}]);

/* Create prompt */

program
	.command('project')
	.alias('p')
	.description('Project options')
	.action(project.action());

program
	.command('structure')
	.alias('s')
	.description('Structure directories options')
	.action(structure.action());

program
	.command('run')
	.alias('r')
	.description('Run tasks ruiner')
	.action(run);	

program.parse(process.argv);

if (program.args.length === 0)
	program.help();