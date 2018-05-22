const sources = require('./sources.json');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const Src = (() =>{
    
	const projectPath = '../../' + sources.project.path;
	const Path = sources.paths;
	const Files = sources.files;
	
	const mkdir = (dir) => {
	
		mkdirp(dir, function (err) {
			if (err)
				console.error(err);
			else 
				console.log('Dir created.');
		});
		
	};
	
    const input = (type) => {                                   // Return inputs files array.                           
        
		const dir = path.join(__dirname, projectPath, Path.__SRC, Path.src[type]);
		
		if (!fs.existsSync(dir))
			mkdir(dir);
		
        return Files[type].map((item)=>{
            return path.join(__dirname, projectPath, Path.__SRC, Path.src[type], item);
        });
        
    };
    
    const output = (type) => {                                  // Return outputs directory.
        
        const dir = path.join(__dirname, projectPath, Path.__DIST, Path.dist[type]);
		
		if (!fs.existsSync(dir))
			mkdir(dir);
		
        return dir;
        
    };
    
    return {
        input: input,
        output: output
    }
    
})();

console.log(Src.input('css'));

/*module.exports = {
	Src
};*/