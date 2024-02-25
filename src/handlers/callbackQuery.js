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
	ADD_SELECTED_SOURCE,
	ADD_SOURCE_RADIO,
	ADD_RADIO
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
const { deleteMessage } = require('../utils/messages/deleteMessage');
const { radios } = require('../constants/radios');
const { generateInlineKeyboard } = require('../utils/generateInlineKeyboard');
const { addRadioSource } = require('./callbackQuery/Source/radio/addRadioSource');

async function callbackQuery(bot, msg) {
	const [command, ...args] = msg.data.split('-');
	const userId = msg.from.id;
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
				const sourceId = args[0];
				getCurrentSource(bot, tgChatId, sourceId);
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

				addChatSource(bot, tgChatId, userId, sourceChatId);
			})();
			break;
		case ADD_SELECTED_SOURCE:
			(async () => {
				const currentSourceId = args[0];
				const currentChatId = args[1];
				addSelectedSource(bot, tgChatId, currentSourceId, currentChatId);
			})();
			break;
		case ADD_SOURCE_RADIO:
			bot.sendMessage(tgChatId, 'Выберите радио которое хотите добавить:', {
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						...generateInlineKeyboard(radios, 2),
						[{ text: '🚫 Отменить', callback_data: DELETE_CURRENT_MESSAGE }]
					]
				}
			});
			break;
		case ADD_RADIO:
			(async () => {
				const radioUrl = args[0];
				const radioName = args[1];

				addRadioSource(bot, tgChatId, radioName, radioUrl, userId);
			})();
		default:
			return;
	}
};

module.exports = { callbackQuery };