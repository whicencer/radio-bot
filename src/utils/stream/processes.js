class Processes {
	constructor() {
		this.processes = {};
	}

	addProcess(id, process, sourceTitle, currentIndex) {
		this.processes[id] = { sourceTitle, process, currentIndex };
	}

	stopProcess(id) {
		try {
			this.processes[id].process.kill();
		} catch (error) {
			console.log("Error while stopping process: ", error);
		}
		delete this.processes[id];
	}

	getSourceTitle(id) {
		return this.processes[id]?.sourceTitle || 'Порожньо';
	}

	getProcessById(id) {
		return this.processes[id];
	}
}

const processes = new Processes();

module.exports = { processes };