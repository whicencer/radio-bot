const { WAITING_FOR_YT_LINK } = require('../constants/state');
const botState = require('../utils/state');
const { youtubeLinkHandler } = require('./message/youtubeLinkHandler');

async function message(bot, msg) {
	const currentBotState = botState.getState();
	const userId = msg.from.id;
	const chatId = msg.chat.id;
	const msgText = msg.text;

	switch (currentBotState) {
		case WAITING_FOR_YT_LINK:
			youtubeLinkHandler(bot, userId, chatId, msgText);
			break;
		default:
			break;
	}
}

module.exports = { message };