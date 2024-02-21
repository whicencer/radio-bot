function editReplyButtons(bot, msg, changeButtonCallbackData, newButton) {
	const chatId = msg.message.chat.id;
	const messageId = msg.message.message_id;

	const newInlineKeyboard = msg.message.reply_markup.inline_keyboard.map(row => {
		return row.map(button => {
			if (button.callback_data === changeButtonCallbackData) {
				return newButton;
			}
			return button;
		});
	});

	bot.editMessageReplyMarkup({ inline_keyboard: newInlineKeyboard }, { chat_id: chatId, message_id: messageId });
};

module.exports = { editReplyButtons };