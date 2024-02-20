const { REMOVE_CHAT, DELETE_CURRENT_MESSAGE } = require('../../../constants/callbackQueries');
const { Chat: ChatModel } = require('../../../database/models');

async function getCurrentChat(bot, chatId, chatName) {
	try {
		const chat = await ChatModel.findOne({ where: { name: chatName } });
		
		const changeStatusButton = chat.status === 'off'
			? { text: '🔥 Запустить', callback_data: 'test1' }
			: { text: '🚫 Остановить', callback_data: 'test1' };

		bot.sendMessage(chatId, `<b>Чат: <code>${chatName}</code></b>\n<b>Ссылка на чат: ${chat.chatLink}</b>`, {
			reply_markup: {
				inline_keyboard: [
					[
						changeStatusButton,
						{ text: '⚙️ Настройки', callback_data: 'test2' }
					],
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