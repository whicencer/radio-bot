const { User: UserModel } = require('../database/models');

async function getUserProfile(ctx) {
	const userId = ctx.message.from.id;

	try {
		const user = await UserModel.findOne({ where: { id: userId } });
		const message = `
		📌 Ваш id: ${userId}\n
	💰 Баланс: ${user.balance}$\n
	👥 Количество рефералов: 12
		`;

		await ctx.reply(message, {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Пополнить баланс', callback_data: 'test' }],
					[{ text: 'Реферальная ссылка', callback_data: 'test' }]
				]
			}
		});
	} catch (error) {
		console.log('Error:', error);
	}
}

module.exports = { getUserProfile };