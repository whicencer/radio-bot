const { ADD_SOURCE, REMOVE_SOURCE, ADD_SOURCE_YOUTUBE, GET_CURRENT_SOURCE, DELETE_CURRENT_MESSAGE } = require('../constants/callbackQueries');
const { addSource } = require('./callbackQuery/addSource');
const { addSourceYoutube } = require('./callbackQuery/addSourceYoutube');
const { removeSource } = require('./callbackQuery/removeSource');
const { getCurrentSource } = require('./callbackQuery/getCurrentSource');
const botState = require('../utils/state');

async function callbackQuery(bot, msg) {
	const data = msg.data.split(' ');
	const chatId = msg.message.chat.id;

	switch (data[0]) {
		case ADD_SOURCE:
			addSource(bot, chatId);
			break;
		case ADD_SOURCE_YOUTUBE:
			addSourceYoutube(bot, chatId);
			break;
		case GET_CURRENT_SOURCE:
			const sourceLink = data[1];
			getCurrentSource(bot, chatId, sourceLink);
			break;
		case REMOVE_SOURCE:
			const url = data[1];
			removeSource(bot, chatId, url);		
			break;
		case DELETE_CURRENT_MESSAGE:
			const messageId = msg.message.message_id;
			bot.deleteMessage(chatId, messageId);
			botState.clearState();
			break;
		default:
			return;
	}
};

module.exports = { callbackQuery };