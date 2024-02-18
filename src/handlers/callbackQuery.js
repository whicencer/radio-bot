const { ADD_SOURCE, ADD_SOURCE_YOUTUBE } = require('../constants/callbackQueries');
const { addSource } = require('./callbackQuery/addSource');
const { addSourceYoutube } = require('./callbackQuery/addSourceYoutube');

async function callbackQuery(bot, msg) {
	const data = msg.data;
	const chatId = msg.message.chat.id;

	switch (data) {
		case ADD_SOURCE:
			addSource(bot, chatId);
			break;
		case ADD_SOURCE_YOUTUBE:
			addSourceYoutube(bot, chatId);
			break;
		default:
			return;
	}
};

module.exports = { callbackQuery };