const { WAITING_FOR_YT_LINK, WAITING_FOR_CHAT_INFO } = require('../constants/state');
const botState = require('../utils/state');
const { youtubeLinkHandler } = require('./message/youtubeLinkHandler');
const { chatInfoHandler } = require('./message/chatInfoHandler');

async function message(bot, msg) {
	const currentBotState = botState.getState();
	const userId = msg.from.id;
	const chatId = msg.chat.id;
	const msgText = msg.text;

	switch (currentBotState) {
		case WAITING_FOR_YT_LINK:
			youtubeLinkHandler(bot, userId, chatId, msgText);
			break;
		case WAITING_FOR_CHAT_INFO:
			chatInfoHandler(bot, userId, chatId, msgText);
			break;
		default:
			break;
	}
}

module.exports = { message };