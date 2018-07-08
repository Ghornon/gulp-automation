'use strict';

const Logger = require('./Logger.js');
const fs = require('fs');
const path = require('path');
const Interface = require('./Interface.js');

const Paths = {
	projects: path.join(__dirname, '../config/projects.json'),
	structures: path.join(__dirname, '../config/structures/')
};

const projectsFile = require(Paths.projects);

/* Structures */

const Structures = (() => {
	
	const _writeFile = (name, structure, msg) => {
		
		try {

			const filePath = path.join(Paths.structure, name);
			const file = JSON.stringify(structure, null, 4);
			
			fs.writeFileSync(filePath, file);
			
			Logger.success(msg);
			
			// console.log(file);


		} catch (Error) {

			Logger.error(Error.message);

		}
		
	};

	const _checkStructure = (structure) => {

		try {

			const IStructure = new Interface('IStructure', [], ['paths', 'files', 'bundle']);
			const IStructurePaths = new Interface('IStructurePaths', [], ['input', 'output']);

			IStructure.isImplementedBy(structure);
			IStructurePaths.isImplementedBy(structure.paths);

			const a = structure.paths.input.length;
			const b = structure.paths.output.length;
			const c = structure.files.length;
			const d = structure.bundle.length;

			if (a != b || b != c || c != d)
				throw new Error("The object doesn't implement all interfaces. Bad properties length!");
			
		} catch (Error) {

			Logger.error(Error.message);

		}

	};

	const _checkName = (name) => {

		const regExp = new RegExp('/^[^\\/:*?"<>|.]+(.)+(json)+$/');

		if (!regExp.test(name))
			throw new Error("Bad file name! The file name can not include special characters and must be in json format!");

	};

	const isExists = (name) => {

		const filePath = path.join(Paths.structures, name);
		
		_checkName(name);

		if (!fs.existsSync(filePath))
			return false;

		return true;
		
	}; 

	const list = () => {

		const files = [];

		fs.readdirSync(Paths.structures).forEach(file => {
			files.push(file);
		});

		return files;

	};

	const get = (name) => {
		
		try {
			
			if (!isExists(name))
				throw new Error(`Cannot find structure file named ${name}!`);
			
			const filePath = path.join(Paths.structures, name);
			const structure = require(filePath);

			_checkStructure(structure);

			return structure;
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}
		
	};
	
	const add = (name, structure) => {

		try {
			
			if (isExists(name))
				throw new Error("This file name has already existed!");

			_checkStructure(structure);
			
			_writeFile(name, structure, "Successfully added new structure file.");
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}

	};
	
	const edit = (name, structure) => {

		try {
			
			if (!isExists(name))
				throw new Error(`Cannot find file named ${name}!`);

			_checkStructure(structure);

			_writeFile(name, structure, "Successfully edited structure file.");
			
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}

	};
	
	const remove = (name) => {

		try {
			
			if (!isExists(name))
				throw new Error(`Cannot find file named ${name}!`);
			
			const filePath = path.join(Paths.structures, name);

			fs.unlinkSync(filePath);
			
			Logger.success("Successfully removed structure file.");
			
			
		} catch (Error) {
			
			Logger.error(Error.message);
			
		}

	};
	
	return {
		isExists,
		list,
		get,
		add,
		edit, 
		remove
	};
	
})();

/* Project */

const Project = (() => {
	
	const IProject = new Interface('IProject', [], ['name', 'dirName', 'structureFile', 'bundler']);
	
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
	
	const add = (obj, callback) => {
		
		try {
			
			IProject.isImplementedBy(obj);
			
			const result = this.projects.find((element) => {
				
				return (element.name == obj.name) || (element.dirName == obj.dirName);
				
			});
			
			if (result)
				throw new Error("This name or directory name has already existed!");

			if (!Structures.isExists(obj.structureFile))
				throw new Error(`Cannot find structure file named ${obj.structureFile}!`);

			this.projects.push(obj);
			_writeFile("Successfully added new project.");

			if (callback && typeof callback === 'function')
				callback();
			
		} catch (Error) {

			Logger.error(Error.message);

		}	
		
	};
	
	const edit = (index, obj, callback) => {
		
		try {
			
			_checkIndex(index);
			IProject.isImplementedBy(obj);

			if (!Structures.isExists(obj.structureFile))
				throw new Error(`Cannot find structure file named ${obj.structureFile}!`);
			
			this.projects[index] = obj;
			
			_writeFile("Successfully edited project.");

			if (callback && typeof callback === 'function')
				callback();
			
		} catch (Error) {

			Logger.error(Error.message);

		}	
		
	};
	
	const remove = (index, callback) => {
		
		try {
			
			_checkIndex(index);
			this.projects.splice(index, 1);
			
			_writeFile("Successfully removed project.");

			if (callback && typeof callback === 'function')
				callback();
			
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
	
	const get = (index) => {
		
		if (typeof index !== 'number')
			index = Project.findIndex(this.name);

		const project = Project.get(index);

		const structure = Structures.get(project.structureFile);

		const workspace = Object.assign({}, project, structure);

		return workspace;	
		
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

// console.log(Structures.list());

/* Exports */

module.exports = {
	Structures,
	Workspace,
	Project
};