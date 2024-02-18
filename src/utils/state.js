class BotState {
	constructor(initialState) {
		this.state = initialState;
	}

	changeState(newState) {
		if (newState !== this.state) {
			this.state = newState;
		}
	}

	clearState() {
		this.state = '';
	}

	getState() {
		return this.state;
	}
};

const botState = new BotState('');

module.exports = botState;