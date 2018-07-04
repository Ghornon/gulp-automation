'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { Workspace } = require('./config.js');
const Logger = require('./Logger.js');

const Directories = (() => {
	
	const mkdir = (dir) => {

		for (let i = 0; i < dir.length; i ++) {

			if (!fs.existsSync(dir[i])) {

				mkdirp(dir[i], function (err) {

					if (err)
						Logger.error(err);
					else
						Logger.success(`${dir[i]} created.`);

				});

			}

		}

	};

	const make = (index) => {
			
		const current = Workspace.get(index);

		const projectPath = path.join('../..', current.dirName);
		const Paths = current.paths;

		const dirs = [];

		Object.keys(Paths.input).map((element) => {

			const newPath = path.join(__dirname, projectPath, Paths.input[element]);

			dirs.push(newPath);

			return newPath;

		});

		Object.keys(Paths.output).map((element) => {

			const newPath = path.join(__dirname, projectPath, Paths.output[element]);

			dirs.push(newPath);

			return newPath;

		});

		mkdir(dirs);

	};
	
	return { make };
	
})();

module.exports = Directories;