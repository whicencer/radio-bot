class Processes {
	constructor() {
		this.processes = {};
	}

	addProcess(id, process, sourceTitle) {
		this.processes[id] = { sourceTitle, process };
	}

	stopProcess(id) {
		this.processes[id].process.kill();
		delete this.processes[id];
	}

	getSourceTitle(id) {
		return this.processes[id]?.sourceTitle || 'Пусто';
	}
}

const processes = new Processes();

module.exports = { processes };