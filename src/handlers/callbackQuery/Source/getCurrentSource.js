const { REMOVE_SOURCE, DELETE_CURRENT_MESSAGE } = require('../../../constants/callbackQueries');
const { Resource: ResourceModel } = require('../../../database/models');

async function getCurrentSource(bot, chatId, sourceId) {
	const source = await ResourceModel.findOne({ where: { id: sourceId } });
	const messageText = `🔗 Ссылка на ресурс: ${source.url}`;

	bot.sendMessage(chatId, messageText, {
		reply_markup: {
			inline_keyboard: [
				[{ text: '❌ Удалить ресурс', callback_data: `${REMOVE_SOURCE}-${sourceId}` }],
				[{ text: '⬇️ Скрыть сообщение', callback_data: `${DELETE_CURRENT_MESSAGE}` }]
			]
		}
	});
};

module.exports = { getCurrentSource };