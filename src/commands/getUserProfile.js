const { PAY } = require('../constants/callbackQueries');
const { User: UserModel } = require('../database/models');

async function getUserProfile(bot, msg) {
	const chatId = msg.chat.id;
	const userId = msg.from.id;

	try {
		const user = await UserModel.findOne({ where: { id: userId } });
		const message = `
		📌 Ваш id: ${userId}\n
	💰 Баланс: ${user.balance}$
		`;

		bot.sendMessage(chatId, message, {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Пополнить баланс', callback_data: PAY }]
				]
			}
		});
	} catch (error) {
		console.log('Error:', error);
	}
}

module.exports = { getUserProfile };