const botState = require('../../utils/state');
const { createYoutubeSource } = require('../../utils/createYoutubeSource');

async function youtubeLinkHandler(bot, userId, chatId, msgText) {
	const inProcessMsg = await bot.sendMessage(chatId, 'Ресурс в процессе добавления...');

	try {
		await createYoutubeSource(msgText, userId);
		bot.sendMessage(chatId, 'Ресурс был успешно добавлен!');
		bot.deleteMessage(chatId, inProcessMsg.message_id);
	} catch (err) {
		bot.sendMessage(chatId, err.message);
	} finally {
		botState.clearState();
	}
}

module.exports = { youtubeLinkHandler };