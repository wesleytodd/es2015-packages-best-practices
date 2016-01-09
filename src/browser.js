export default class Logger {

	constructor (file, name) {
		// Just discards file
		this.name = name;
	}

	log (msg) {
		console.log(this.name + ': ' + msg);
	}

}
