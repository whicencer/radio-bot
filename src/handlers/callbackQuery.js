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
	ADD_RADIO,
	START_STREAM,
	STOP_STREAM
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
const { addRadioSource } = require('./callbackQuery/Source/radio/addRadioSource');
const { addSourceRadio } = require('./callbackQuery/Source/addSourceRadio');
const { Chat: ChatModel } = require('../database/models');
const { startStream } = require('../utils/stream/startStream');
const { editReplyButtons } = require('../utils/buttons/editReplyButtons');
const { stopStream } = require('../utils/stream/stopStream');
const { allProccesses } = require('../utils/proccesses');

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
			addSourceRadio(bot, tgChatId)
			break;
		case ADD_RADIO:
			(async () => {
				const radioUrl = args[0];
				const radioName = args[1];

				addRadioSource(bot, tgChatId, radioName, radioUrl, userId);
			})();
			break;
		case START_STREAM:
			(async () => {
				const chatId = args[0];
				const { resources } = await ChatModel.findOne({ where: { id: chatId }, include: 'resources' });

				const proccess = await startStream(resources, chatId);
				allProccesses.addProccess(chatId, proccess);

				editReplyButtons(bot, msg, `${START_STREAM}-${chatId}`, { text: '🚫 Остановить', callback_data: `${STOP_STREAM}-${chatId}` })
			})();
			break;
		case STOP_STREAM:
			(async () => {
				const chatId = args[0];
				const proccess = allProccesses.getProccessByChatId(chatId);

				await stopStream(proccess);
			})();
			break;
		default:
			return;
	}
};

module.exports = { callbackQuery };