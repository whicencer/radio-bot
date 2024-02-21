function addReplyButtons(bot, msg, newButton) {
	const chatId = msg.message.chat.id;
	const messageId = msg.message.message_id;
	
	msg.message.reply_markup.inline_keyboard.unshift([newButton]);

	bot.editMessageReplyMarkup({ inline_keyboard: msg.message.reply_markup.inline_keyboard }, { chat_id: chatId, message_id: messageId });
};

module.exports = { addReplyButtons };