const botState = require('../../utils/state');
const { WAITING_FOR_CHAT_INFO } = require('../../constants/state');
const { DELETE_CURRENT_MESSAGE } = require('../../constants/callbackQueries');

async function addChat(bot, chatId) {
	bot.sendMessage(chatId, `Введите название чата и ссылку на сервер трансляции\n\nПример:\n<code>Rock Radio</code>\n<code>rtmps://dc4-1.rtmp.t.me/s/1694371569:_TcfFzvleD-sHZIQYVr25h</code>`, {
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