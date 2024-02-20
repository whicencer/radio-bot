const { REMOVE_CHAT, DELETE_CURRENT_MESSAGE, CHAT_SOURCES } = require('../../../constants/callbackQueries');
const { Chat: ChatModel } = require('../../../database/models');

async function getCurrentChat(bot, chatId, chatName) {
	try {
		const chat = await ChatModel.findOne({ where: { name: chatName } });
		
		const changeStatusButton = chat.status === 'off'
			? { text: '🔥 Запустить', callback_data: `test` }
			: { text: '🚫 Остановить', callback_data: `test` };

		bot.sendMessage(chatId, `<b>Чат: <code>${chatName}</code></b>\n<b>Ссылка на чат: ${chat.chatLink}</b>`, {
			reply_markup: {
				inline_keyboard: [
					[changeStatusButton],
					[{ text: '🎥 Библиотека эфира', callback_data: `${CHAT_SOURCES}-${chatName}` }],
					[{ text: '❌ Удалить чат', callback_data: `${REMOVE_CHAT}-${chatName}` }],
					[{ text: '⬅️ Назад', callback_data: DELETE_CURRENT_MESSAGE }]
				]
			},
			parse_mode: 'HTML'
		});
	} catch (error) {
		console.error("Error while processing GET_CURRENT_CHAT:", error);
		bot.sendMessage(chatId, "❌ Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.");
	}
};

module.exports = { getCurrentChat };