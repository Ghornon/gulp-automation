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

				Logger.info(`${dir[i]} creating...`);

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

		if (index === undefined)
			index = Workspace.getIndex();

		const current = Workspace.getObject(index);

		const projectPath = path.join('../..', current.dirName);
		const Paths = current.paths;

		const dirs = [];

		Object.keys(Paths.src).map((element) => {

			const newPath = path.join(__dirname, projectPath, Paths.src[element]);

			dirs.push(newPath);

			return newPath;

		});

		Object.keys(Paths.dist).map((element) => {

			const newPath = path.join(__dirname, projectPath, Paths.dist[element]);

			dirs.push(newPath);

			return newPath;

		});

		mkdir(dirs);

	};
	
	return { make };
	
})();

module.exports = Directories;