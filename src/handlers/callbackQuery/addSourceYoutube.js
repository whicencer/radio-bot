const { WAITING_FOR_YT_LINK } = require('../../constants/state');
const botState = require('../../utils/state');

async function addSourceYoutube(bot, chatId) {
	bot.sendMessage(chatId, 'Отправьте ссылку на видео на YouTube\n\nПример: https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
		disable_web_page_preview: true
	});

	botState.changeState(WAITING_FOR_YT_LINK);
}

module.exports = { addSourceYoutube };