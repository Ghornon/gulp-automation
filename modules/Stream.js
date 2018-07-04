'use strict';

const path = require('path');
const { Workspace } = require('./config.js');

const Stream = (() =>{
    
	const current = Workspace.get();
	
	const projectPath = path.join(__dirname, '../..', current.dirName);
	const Paths = current.paths;
	const Files = current.files;
	
	const input = (type) => {                                   // Return inputs files array.
		
		return Files[type].map((item)=>{
			return path.normalize(path.join(projectPath, Paths.input[type], item));
		});
        
	};
    
	const output = (type) => {                                  // Return outputs directory.
        
		const dir = path.normalize(path.join(projectPath, Paths.output[type]));
		
		return dir;
        
	};
    
	return {
		input,
		output
	};
    
})();

//console.log(Stream.input('html'), Stream.output('css'));

module.exports = Stream;