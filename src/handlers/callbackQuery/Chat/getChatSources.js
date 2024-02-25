const { DELETE_CURRENT_MESSAGE, REMOVE_CHAT_SOURCE, ADD_CHAT_SOURCE } = require('../../../constants/callbackQueries');
const { Chat: ChatModel } = require('../../../database/models');

async function getChatSources(bot, chatId, chatName) {
	const chat = await ChatModel.findOne({ where: { name: chatName }, include: 'resources' });
	const chatResources = chat.resources.map(resource => [{text: `🎧 ${resource.name}`, callback_data: `${REMOVE_CHAT_SOURCE}-${resource.id}-${chat.id}`}]);

	bot.sendMessage(chatId, `Библиотека чата: <b>${chatName}</b>`, {
		reply_markup: {
			inline_keyboard: [
				...chatResources,
				[{text: '➕ Добавить ресурс', callback_data: `${ADD_CHAT_SOURCE}-${chat.id}`}],
				[{text: '⬅️ Назад', callback_data: DELETE_CURRENT_MESSAGE}],
			]
		},
		parse_mode: 'HTML'
	});
};

module.exports = { getChatSources };