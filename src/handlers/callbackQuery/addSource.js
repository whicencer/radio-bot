const { ADD_SOURCE_YOUTUBE } = require('../../constants/callbackQueries');

async function addSource(bot, chatId) {
	bot.sendMessage(chatId, 'Выберите источник добавления ресурса', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Youtube', callback_data: ADD_SOURCE_YOUTUBE }]
			]
		}
	});
}

module.exports = { addSource };