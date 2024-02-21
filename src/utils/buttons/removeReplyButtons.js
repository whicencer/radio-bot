function removeReplyButtons(bot, msg, deleteButtonCallbackData) {
	const chatId = msg.message.chat.id;
	const messageId = msg.message.message_id;
	
	const newInlineKeyboard = msg.message.reply_markup.inline_keyboard.map(row => {
		return row.filter(button => {
			const data = button.callback_data;
			return data !== deleteButtonCallbackData;
		});
	});

	bot.editMessageReplyMarkup({ inline_keyboard: newInlineKeyboard }, { chat_id: chatId, message_id: messageId });
};

module.exports = { removeReplyButtons };