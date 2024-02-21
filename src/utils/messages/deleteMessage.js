async function deleteMessage(bot, chatId, messageId) {
	await bot.deleteMessage(chatId, messageId);
};

module.exports = { deleteMessage };