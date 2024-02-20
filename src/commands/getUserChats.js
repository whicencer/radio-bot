const { ADD_CHAT, GET_CURRENT_CHAT } = require('../constants/callbackQueries');
const { User: UserModel } = require('../database/models');

async function getUserChats(bot, msg) {
	const chatId = msg.chat.id;
	const userId = msg.from.id;

	const user = await UserModel.findOne({ where: {id: userId}, include: 'chats' });
	const chatsBtns = user.chats.map(chat => ([{ text: chat.name, callback_data: `${GET_CURRENT_CHAT}-${chat.name}` }]));

	bot.sendMessage(chatId, '💬 Ваши чаты', {
		reply_markup: {
			inline_keyboard: [
				...chatsBtns,
				[{ text: '➕ Добавить чат', callback_data: ADD_CHAT }]
			]
		}
	});
};

module.exports = { getUserChats };