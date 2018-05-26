'use strict';

const path = require('path');
const { Workspace } = require('./config.js');

const Stream = (() =>{
    
	const current = Workspace.getObject(Workspace.getIndex());
	
	const projectPath = path.join('../..', current.dirName);
	const Paths = current.paths;
	const Files = current.files;
	
    const input = (type) => {                                   // Return inputs files array.
		
        return Files[type].map((item)=>{
            return path.normalize(path.join(__dirname, projectPath, Paths.src[type], item));
        });
        
    };
    
    const output = (type) => {                                  // Return outputs directory.
        
        const dir = path.normalize(path.join(__dirname, projectPath, Paths.dist[type]));
		
        return dir;
        
    };
    
    return {
        input,
        output
    }
    
})();

//console.log(Stream.input('html'), Stream.output('css'));

module.exports = Stream;