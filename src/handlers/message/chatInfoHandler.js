const botState = require('../../utils/state');
const { Chat: ChatModel } = require('../../database/models');
const { rtmpKeyValidate } = require('../../utils/validators/rtmpKeyValidate');

async function chatInfoHandler(bot, userId, chatId, msgText) {
	const [chatName, streamKey, chatLink] = msgText.split('\n');
	const successMessage = '✅ Чат был успешно добавлен!';
	const errorMessage = '❌ Возникла ошибка при добавлении чата';

	const processMsg = await bot.sendMessage(chatId, 'Добавление чата...');
	try {
		rtmpKeyValidate(streamKey);
		
		await ChatModel.create({ userId, name: chatName, streamKey, chatLink});
		bot.sendMessage(chatId, successMessage);
	} catch (error) {
		bot.sendMessage(chatId, `${errorMessage}: ${error.message}`);
	} finally {
		bot.deleteMessage(chatId, processMsg.message_id);
		botState.clearState();
	}
};

module.exports = { chatInfoHandler };