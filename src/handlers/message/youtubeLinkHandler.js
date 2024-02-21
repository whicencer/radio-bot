const botState = require('../../utils/state');
const { createYoutubeSource } = require('../../utils/createYoutubeSource');
const { youtubeUrlValidate } = require('../../utils/validators/youtubeUrlValidate');

async function youtubeLinkHandler(bot, userId, chatId, msgText) {
	const inProcessMsg = await bot.sendMessage(chatId, 'Ресурс в процессе добавления...');

	
	try {
		youtubeUrlValidate(msgText);
		await createYoutubeSource(msgText, userId);
		bot.sendMessage(chatId, '✅ Ресурс был успешно добавлен!');
	} catch (err) {
		bot.sendMessage(chatId, err.message);
	} finally {
		bot.deleteMessage(chatId, inProcessMsg.message_id);
		botState.clearState();
	}
}

module.exports = { youtubeLinkHandler };