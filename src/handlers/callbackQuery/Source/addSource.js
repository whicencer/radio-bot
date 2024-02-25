const { ADD_SOURCE_YOUTUBE, DELETE_CURRENT_MESSAGE, ADD_SOURCE_RADIO } = require('../../../constants/callbackQueries');

async function addSource(bot, chatId) {
	bot.sendMessage(chatId, 'Выберите источник добавления ресурса', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🎦🎶 Youtube', callback_data: ADD_SOURCE_YOUTUBE }],
				[{ text: '🎶 Radio UA', callback_data: ADD_SOURCE_RADIO }],
				[{ text: '🚫 Отменить', callback_data: DELETE_CURRENT_MESSAGE }]
			]
		}
	});
}

module.exports = { addSource };