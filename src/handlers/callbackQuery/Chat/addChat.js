const botState = require('../../../utils/state');
const { WAITING_FOR_CHAT_INFO } = require('../../../constants/state');
const { DELETE_CURRENT_MESSAGE } = require('../../../constants/callbackQueries');

async function addChat(bot, chatId) {
	bot.sendMessage(chatId, `Введите название чата, его ссылку, и ключ сервера трансляции\n\nПример:\n<code>Rock Radio</code>\n<code>1694371569:_TcfFzvleD-sHZIQYVr25h</code>\n<code>https://t.me/arat34t</code>`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Отменить', callback_data: DELETE_CURRENT_MESSAGE }]
			]
		},
		parse_mode: 'HTML'
	});

	botState.changeState(WAITING_FOR_CHAT_INFO);
};

module.exports = { addChat };