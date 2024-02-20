const { ADD_SOURCE_YOUTUBE, DELETE_CURRENT_MESSAGE } = require('../../../constants/callbackQueries');

async function addSource(bot, chatId) {
	bot.sendMessage(chatId, 'Выберите источник добавления ресурса', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🎦🎶 Youtube', callback_data: ADD_SOURCE_YOUTUBE }],
				[{ text: '🚫 Отменить', callback_data: DELETE_CURRENT_MESSAGE }]
			]
		}
	});
}

module.exports = { addSource };