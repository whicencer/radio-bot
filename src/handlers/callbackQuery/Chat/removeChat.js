const { Chat: ChatModel } = require('../../../database/models');

async function removeChat(bot, chatId, chatName) {
	try {
		ChatModel.destroy({ where: { name: chatName } });
		bot.sendMessage(chatId, `✅ Чат ${chatName} был успешно удалён!`);
	} catch (error) {
		console.error("Error while processing REMOVE_CHAT:", error);
		bot.sendMessage(chatId, "❌ Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.");
	}
};

module.exports = { removeChat };