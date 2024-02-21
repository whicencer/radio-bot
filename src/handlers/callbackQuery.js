const {
	ADD_SOURCE,
	REMOVE_SOURCE,
	ADD_SOURCE_YOUTUBE,
	GET_CURRENT_SOURCE,
	DELETE_CURRENT_MESSAGE,
	ADD_CHAT,
	GET_CURRENT_CHAT,
	REMOVE_CHAT,
	CHAT_SOURCES,
	REMOVE_CHAT_SOURCE,
	ADD_CHAT_SOURCE,
	ADD_SELECTED_SOURCE
} = require('../constants/callbackQueries');

const {
	addSource,
	addSourceYoutube,
	getCurrentSource,
	removeSource
} = require('./callbackQuery/Source');

const {
	addChat,
	getCurrentChat,
	removeChat,
	getChatSources,
	removeChatSource,
	addChatSource,
	addSelectedSource
} = require('./callbackQuery/Chat');

const botState = require('../utils/state');
const { Resource: ResourceModel, Chat } = require('../database/models');
const { deleteMessage } = require('../utils/messages/deleteMessage');

async function callbackQuery(bot, msg) {
	const [command, ...args] = msg.data.split('-');
	const tgChatId = msg.message.chat.id;
	const messageId = msg.message.message_id;

	switch (command) {
		case ADD_SOURCE:
			addSource(bot, tgChatId);
			break;
		case ADD_SOURCE_YOUTUBE:
			addSourceYoutube(bot, tgChatId);
			break;
		case GET_CURRENT_SOURCE:
			(async () => {
				const sourceLink = args[0];
				getCurrentSource(bot, tgChatId, sourceLink);
			})();
			break;
		case REMOVE_SOURCE:
			(async () => {
				const url = args[0];
				removeSource(bot, tgChatId, url);
			})();
			break;
		case DELETE_CURRENT_MESSAGE:
			deleteMessage(bot, tgChatId, messageId);
			botState.clearState();
			break;
		case ADD_CHAT:
			addChat(bot, tgChatId);
			break;
		case GET_CURRENT_CHAT:
			(async () => {
				const chatName = args[0];
				getCurrentChat(bot, tgChatId, chatName);
			})();
			break;
		case REMOVE_CHAT:
			(async () => {
				const chatName = args[0];
				removeChat(bot, tgChatId, chatName);
			})();
			break;
		case CHAT_SOURCES:
			(async () => {
				const chatName = args[0];
				getChatSources(bot, tgChatId, chatName);
			})();
			break;
		case REMOVE_CHAT_SOURCE:
			(async () => {
				const chatSourceIdToDelete = args[0];
				const currentChatId = args[1];
				removeChatSource(bot, msg, chatSourceIdToDelete, currentChatId);
			})();
			break;
		case ADD_CHAT_SOURCE:
			(async () => {
				const sourceChatId = args[0];
				deleteMessage(bot, tgChatId, messageId);
				addChatSource(bot, tgChatId, sourceChatId);
			})();
			break;
		case ADD_SELECTED_SOURCE:
			(async () => {
				const currentSourceId = args[0];
				const currentChatId = args[1];
				addSelectedSource(bot, tgChatId, currentSourceId, currentChatId);
			})();
			break;
		// case START_STREAM:
		// 	editReplyButtons(bot, msg, START_STREAM, { text: '🚫 Остановить', callback_data: STOP_STREAM });
		// 	break;
		// case STOP_STREAM:
		// 	editReplyButtons(bot, msg, STOP_STREAM, { text: '🔥 Запустить', callback_data: START_STREAM });
		// 	break;
		default:
			return;
	}
};

module.exports = { callbackQuery };