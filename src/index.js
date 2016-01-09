var fs = require('fs');

export default class Logger {

	constructor (file, name) {
		this.file = fs.createWriteStream(file);
		this.name = name;
	}

	log (msg) {
		this.file.write(this.name + ': ' + msg + '\n');
	}

}
