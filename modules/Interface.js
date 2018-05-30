class Interface {
	
	constructor(name, methods = [], properties = []) {
		
		this.name = name;
		this.methods = [];
		this.properties = [];
		
		for (let i = 0; i < methods.length; i++) {
			
			if (typeof methods[i] !== 'string')
				throw new Error("Names of the interface expect methods name as string!");
			
			this.methods.push(methods[i]);
			
		}
		
		for (let i = 0; i < properties.length; i++) {
			
			if (typeof properties[i] !== 'string')
				throw new Error("Names of the interface expect properties name as string!");
			
			this.properties.push(properties[i]);
			
		}
		
	}
	
	isImplementedBy(obj) {
		
		if (obj) {
			
			for (let i = 0; i < this.methods.length; i++) {
				
				const currentMember = this.methods[i];
				
				if (!obj[currentMember] || typeof obj[currentMember] !== 'function')
					throw new Error(`Object not implement interface ${this.name}. Cannot find method ${currentMember}!`);
				
			}
			
			for (let i = 0; i < this.properties.length; i++) {
				
				const currentMember = this.properties[i];
				
				if (!obj[currentMember] || typeof obj[currentMember] === 'function')
					throw new Error(`Object not implement interface ${this.name}. Cannot find properties ${currentMember}!`);
				
			}
			
		} else {
			
			throw new Error("Cannot find object!");
			
		}
		
	}
	
}

module.exports = Interface;