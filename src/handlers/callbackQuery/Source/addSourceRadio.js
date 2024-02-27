const { generateInlineKeyboard } = require('../../../utils/generateInlineKeyboard');
const { radios } = require('../../../constants/radios');
const { DELETE_CURRENT_MESSAGE } = require('../../../constants/callbackQueries');

async function addSourceRadio(bot, tgChatId) {
	bot.sendMessage(tgChatId, 'Выберите радио которое хотите добавить:', {
		disable_web_page_preview: true,
		reply_markup: {
			inline_keyboard: [
				...generateInlineKeyboard(radios, 2),
				[{ text: '🚫 Отменить', callback_data: DELETE_CURRENT_MESSAGE }]
			]
		}
	});
};

module.exports = { addSourceRadio };