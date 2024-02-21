const { DELETE_CURRENT_MESSAGE, ADD_SELECTED_SOURCE } = require('../../../constants/callbackQueries');
const { Resource: ResourceModel } = require('../../../database/models');

async function addChatSource(bot, chatId, sourceChatId) {
	const resources = await ResourceModel.findAll();
	bot.sendMessage(chatId, 'Выберите ресурс, который хотите добавить', {
		reply_markup: {
			inline_keyboard: [
				...resources.map(resource => ([{text: resource.name, callback_data: `${ADD_SELECTED_SOURCE}-${resource.id}-${sourceChatId}`}])),
				[{text: '⬅️ Назад', callback_data: DELETE_CURRENT_MESSAGE}]
			]
		}
	});
};

module.exports = { addChatSource };