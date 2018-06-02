'use strict';

const Logger = require('./Logger.js');
const fs = require('fs');
const path = require('path');
const Interface = require('./Interface.js');
const mkdir = require('./Directories.js');

const Paths = {
	projects: path.join(__dirname, '../config/projects.json'),
	sources: path.join(__dirname, '../config/sources/')
};

const projectsFile = require(Paths.projects);

/* Sources */

const Sources = (() => { //In progress
	
	const ISources = new Interface('ISources', [], ['paths', 'files']);
	const IPaths = new Interface('IPaths', [], ['src', 'dist']);
	
	const list = () => {

		const files = [];

		fs.readdirSync(Paths.sources).forEach(file => {
			files.push(file);
		});

		return files;

	};

	const get = (name) => {
		
		try {
			
			const filePath = path.join(Paths.sources, name);
			
			if (!fs.existsSync(filePath))
				throw new Error(`Cannot find file named ${name}!`);
				
			const sources = require(filePath);
			return sources;
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}
		
	};
	
	const add = (name, sources) => {

		try {
			
			ISources.isImplementedBy(sources);
			IPaths.isImplementedBy(sources.paths);
			
			const filePath = path.join(Paths.sources, name);
			
			if (fs.existsSync(filePath))
				throw new Error("This file name has already existed!");
			
			const file = JSON.stringify(sources, null, 4);
			
			fs.writeFileSync(filePath, file);
			
			Logger.success("Successfully added new sources file.");
			
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}

	};
	
	const edit = (name, sources) => {

		try {
			
			ISources.isImplementedBy(sources);
			IPaths.isImplementedBy(sources.paths);
			
			const filePath = path.join(Paths.sources, name);
			
			if (!fs.existsSync(filePath))
				throw new Error(`Cannot find file named ${name}!`);
			
			const file = JSON.stringify(sources, null, 4);
			
			fs.writeFileSync(filePath, file);
			
			Logger.success("Successfully edited sources file.");
			
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}

	};
	
	const remove = (name) => {

		try {
			
			const filePath = path.join(Paths.sources, name);
			
			if (!fs.existsSync(filePath))
				throw new Error(`Cannot find file named ${name}!`);
				
			fs.unlinkSync(filePath);
			
			Logger.success("Successfully removed sources file.");
			
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}

	};
	
	return {
		list,
		get,
		add,
		edit, 
		remove
	};
	
})();

/* Project */

const Project = (() => {
	
	const IProject = new Interface('IProject', [], ['name', 'dirName', 'sourcesFile']);
	
	this.projects = projectsFile.projects;
	
	const _checkIndex = (index) => {
		
		if (typeof index === 'number') {
			
			if (index < 0 || index >= this.projects.length) {
				
				throw new Error("Bad index number!");
				
			} 
				
			
		} else {
			
			throw new Error("Index must be a number!");
			
		}
		
	};
	
	const _checkName = (name) => {
		
		if (typeof name === 'string') {
			
			const obj = this.projects.find((element) => {
		
				return element.name == name;

			});

			if (!obj) {
				
				throw new Error(`Cannot find project named ${name}!`);
				
			}
			
		} else {
			
			throw new Error("The name must be a string!");
			
		}
		
	};
	
	const _writeFile = (msg) => {
		
		try {
			
			Workspace.check();

			const projects = { projects: this.projects };
			const workspace = { workspace: Workspace.getName() };
			const obj =  Object.assign({}, projects, workspace);
			const file = JSON.stringify(obj, null, 4);
			
			fs.writeFileSync(Paths.projects, file);
			
			Logger.success(msg);
			
			// console.log(file);


		} catch (Error) {

			Logger.error(Error.message);

		}
		
	};
	
	const get = (index) => {
		
		try {
			
			_checkIndex(index);
			
			const project = this.projects[index];

			return project;

		} catch (Error) {

			Logger.error(Error.message);

		}
		
	};
	
	const findIndex = (name) => {
		
		try {
			
			_checkName(name);
			
			const index = this.projects.findIndex((element) => { 

				return element.name == name;

			});

			return index;

		} catch (Error) {

			Logger.error(Error.message);

		}
		
	};
	
	const findName = (index) => {
		
		try {
			
			_checkIndex(index);

			return this.projects[index].name;

		} catch (Error) {

			Logger.error(Error.message);

		}
		
	};
	
	const add = (obj) => {
		
		try {
			
			IProject.isImplementedBy(obj);
			
			const result = this.projects.find((element) => {
				
				return (element.name == obj.name) || (element.dirName == obj.dirName);
				
			});
			
			if (result) {
				
				throw new Error("This name or directory name has already existed!");

			}

			this.projects.push(obj);
			_writeFile("Successfully added new project.");
			
		} catch (Error) {

			Logger.error(Error.message);

		}	
		
	};
	
	const edit = (index, obj) => {
		
		try {
			
			_checkIndex(index);
			IProject.isImplementedBy(obj);
			
			this.projects[index] = obj;
			
			_writeFile("Successfully edited project.");
			
		} catch (Error) {

			Logger.error(Error.message);

		}	
		
	};
	
	const remove = (index) => {
		
		try {
			
			_checkIndex(index);
			this.projects.splice(index, 1);
			
			_writeFile("Successfully removed project.");
			
		} catch (Error) {

			Logger.error(Error.message);

		}	
		
	};
	
	return {
		projects: this.projects,
		get,
		findIndex,
		findName,
		add,
		edit,
		remove
	};
	
})();

/* Workspace */

const Workspace = (() => {
	
	this.name = projectsFile.workspace;
	
	const get = () => {
		
		const project = Project.get(Project.findIndex(this.name));
		const sources = Sources.get(project.sourcesFile);

		return Object.assign({}, project, sources);	
		
	};

	const getName = () => {
		
		return this.name;
		
	};

	const check = () => {

		const name = this.name;

		if (typeof name === 'string') {
			
			const obj = this.projects.find((element) => {
		
				return element.name == name;

			});

			if (!obj) {
			
				this.name = null;

			} else {

				this.name = obj.name;

			}

			// console.log(obj, this.name);
			
		} else {
			
			this.name = null;
			
		}

	};

	const set = (index) => {
		
		try {

			this.name = Project.findName(index);

			const projects = { projects: Project.projects };
			
			const workspace = { workspace: this.name };
			
			const obj = Object.assign({}, projects, workspace);
			
			const file = JSON.stringify(obj, null, 4);
			
			fs.writeFileSync(Paths.projects, file);
			
			Logger.success(`Workspace set at ${Logger.chalk.cyan(this.name)}`);

			//			console.log(file);
			

		} catch (Error) {

			Logger.error(Error.message);

		}
		
	};
	
	return {
		get,
		getName,
		check,
		set
	};
	
})();

// console.log(Sources.list());

/* Exports */

module.exports = {
	Sources,
	Workspace,
	Project
};