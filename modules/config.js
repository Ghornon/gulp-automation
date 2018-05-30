'use strict';

const workspace = require('../config/workspace.json');
const projects = require('../config/projects.json');
const Logger = require('./Logger.js');
const fs = require('fs');
const path = require('path');

const Paths = {
	"workspace": path.join(__dirname, '../config/workspace.json'),
	"projects": path.join(__dirname, '../config/projects.json'),
	"sources": path.join(__dirname, '../config/sources/')
};

/* Sources */

const Sources = (() => { //In progress
	
	const get = (name) => {
		
		const sources = require(path.join(Paths.sources, name));
		
		return sources;
		
	};
	
	const add = (name, sources) => {

		const file = JSON.stringify(sources, null, 4);

		fs.writeFileSync(path.join(Paths.sources, name), file);
		
		Logger.success('Sources file created!');

	};
	
})();

/* Workspace */

const Workspace = (() => {
	
	const getIndex = () => {
		
		return workspace.index;
		
	};
	
	const getObject = (index) => {
		
		if (index === undefined)
			index = workspace.index;
		
		const project = projects[index];
		const sources = sources.get(project.sourcesFile);
		
		return Object.assign({}, project, sources);
		
	};
	
	const set = (index) => {
		
		if (index !== undefined) {
			
			if (index >= 0 && index < projects.length) {
				
				workspace.index = index;
				
				const file = JSON.stringify(workspace, null, 4);

				fs.writeFileSync(Paths.workspace, file);

				Logger.success('Workspace seted!');
				
			} else {
				
				Logger.error("Cannot set workspace!");
				
			}
			
			
		} else {
			
			Logger.error("Cannot set workspace!");
			
		}		
		
	};
	
	return {
		getIndex,
		getObject,
		set
	};
	
})();

/* Projects */

const Projects = (() => {
	
	const get = () => {
		
		return projects;
		
	};
	
	const find = (name) => {
		
		let id = 0;
	
		projects.filter((element, index) => {

			if (element.name == name) 
				id = index;

		});
		
		return id;
		
	};
	
	const add = (answers) => {
		
		const result = Projects.get().filter((element) => {
		
			if (element.name == answers.name) {
				
				Logger.error('Project with this name already exists!');
				return true;
				
			} else if (element.dirName == answers.dirName){
				
				Logger.error('Project with this directory name already exists!');
				return true;
				
			} else {
				
				return false;
				
			}

		});

		if (result.length == 0) {

			projects.push(answers);

			const file = JSON.stringify(projects, null, 4);

			fs.writeFileSync(Paths.projects, file);
			
			Logger.success('Project added!');
			
			Workspace.set(0);
			
			return true;

		}
		
		return false;
		
	};
	
	const remove = (index) => {
		
		if (index !== undefined) {
			
			projects.splice(index, 1);
			
			const file = JSON.stringify(projects, null, 4);

			fs.writeFileSync(Paths.projects, file);

			Logger.success('Project removed!');
			
			return true;
			
		} else {
			
			Logger.error("Cannot remove project!");
			
			return false;
			
		}		
		
	};
	
	const edit = (index, obj) => {
		
		if (index !== undefined) {
			
			const result = projects.filter((element) => {
		
				if (element.name == obj.name) {

					Logger.error('Project with this name already exists!');
					return true;

				} else if (element.dirName == obj.dirName){

					Logger.error('Project with this directory name already exists!');
					return true;

				} else {

					return false;

				}

			});

			if (result.length == 0) {

				projects[index].name = obj.name || projects[index].name;
				projects[index].dirName = obj.dirName || projects[index].dirName;
				projects[index].sourcesFile = obj.sourcesFile || projects[index].sourcesFile;

				const file = JSON.stringify(projects, null, 4);

				fs.writeFileSync(Paths.projects, file);

				Logger.success('Project edited!');
				
				return true;
				
			}
			
			return false;
			
		} else {
			
			Logger.error("Cannot edit project!");
			
			return false;
			
		}		
		
	};
	
	return {
		get,
		find,
		add,
		remove,
		edit
	};
	
})();

/* Exports */

module.exports = {
	Workspace,
	Projects
};

