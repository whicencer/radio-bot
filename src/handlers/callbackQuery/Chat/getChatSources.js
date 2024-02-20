const { DELETE_CURRENT_MESSAGE, REMOVE_CHAT_SOURCE } = require('../../../constants/callbackQueries');
const { Chat: ChatModel } = require('../../../database/models');

async function getChatSources(bot, chatId, chatName) {
	const chat = await ChatModel.findOne({ where: { name: chatName }, include: 'resources' });
	const chatResources = chat.resources.map(resource => [{text: `🎧 ${resource.name}`, callback_data: `${REMOVE_CHAT_SOURCE}-${resource.name}-${chat.id}`}]);

	bot.sendMessage(chatId, `${chatName} Library`, {
		reply_markup: {
			inline_keyboard: [
				...chatResources,
				[{text: '➕ Добавить ресурс', callback_data: 'test'}],
				[{text: '⬅️ Назад', callback_data: DELETE_CURRENT_MESSAGE}],
			]
		}
	});
};

module.exports = { getChatSources };