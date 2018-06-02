#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const Logger = require('./modules/Logger.js');
const { Sources, Workspace, Project } = require('./modules/config.js');
const Interface = require('./modules/Interface.js');
const shell = require('shelljs');

const run = () => {

	shell.exec('gulp default');

};

class Chooser {

	constructor(name, message, choices = []) {

		this.name = name;
		this.message = message;
		this.choices = [];

		const IChoices = new Interface('IChoices', [], ['text', 'callback']);
		
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
					return element.text;
				})
		
			}).then((answares) => {
				
				const obj = choices.find((element) => {
					return answares[name] == element.text;
				});

				const callback = obj.callback;

				if (self[callback] && typeof self[callback] === 'function')
					self[callback]();
		
			})
	
		};

	}

};

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
			default: Workspace.name
			
		}).then((answers) => {
			
			const current = answers.select;
	
			Workspace.set(Project.findIndex(current));
			
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
				name: 'sourcesFile',
				message: 'Project sources file name:',
				default: 'default.json'
			}

		]).then((answers) => {

			Logger.info('Creating new project...');

			Project.add(answers);

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
					name: 'sourcesFile',
					message: 'Project sources file name:',
					default: current.sourcesFile
				}
	
			]).then((answers) => {

				Logger.info('Editing project...');
	
				Project.edit(index, answers);
	
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
			
			Logger.info('Removing project...');

			Project.remove(Project.findIndex(current)); //Error during try to remove selected project if the project name is equal workspace name !@#?
			
		});

	}

};

/* Objects */

const project = new ProjectPrompt('Project', 'What do you want to do with the project?', [

	{
		text: 'Select project',
		callback: 'select'
	},
	{
		text: 'Create new project',
		callback: 'create'
	},
	{
		text: 'Edit project',
		callback: 'edit'
	},
	{
		text: 'Remove project ',
		callback: 'remove'
	}

]);

/* Create prompt */

program
	.command('project')
	.alias('p')
	.description('Project options')
	.action(project.action());

const test = new ProjectPrompt('test', 'test msg', [{text: 'Select', callback: 'select'}, {text: 'Test', callback: 'test'}]);

program
	.command('test')
	.alias('t')
	.description('Test options')
	.action(test.action());	

program
	.command('run')
	.alias('r')
	.description('Run tasks ruiner')
	.action(run);	

program.parse(process.argv);

if (program.args.length === 0)
	program.help();