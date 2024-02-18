const { REMOVE_SOURCE, DELETE_CURRENT_MESSAGE } = require('../../constants/callbackQueries');

async function getCurrentSource(bot, chatId, sourceLink) {
	const messageText = `🔗 Ссылка на ресурс: ${sourceLink}`;

	bot.sendMessage(chatId, messageText, {
		reply_markup: {
			inline_keyboard: [
				[{ text: '❌ Удалить ресурс', callback_data: `${REMOVE_SOURCE} ${sourceLink}` }],
				[{ text: '⬇️ Скрыть сообщение', callback_data: `${DELETE_CURRENT_MESSAGE}` }]
			]
		}
	});
};

module.exports = { getCurrentSource };