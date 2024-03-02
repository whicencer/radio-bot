const { Scenes } = require('telegraf');
const { USER_PROFILE_SCENE } = require('../constants/scenes');
const { User } = require('../database/models');
const { capitalizeFirstLetter } = require('../utils/capitalizeFirstLetter');

const userProfile = new Scenes.BaseScene(USER_PROFILE_SCENE);

userProfile.enter(async (ctx) => {
	const userId = ctx.message.from.id;

	try {
		const user = await User.findOne({ where: { id: userId } });

		const message = `
		📌 Ваш id: ${userId}
💰 Баланс: ${user.balance}$
👥 Количество рефералов: ${user.referrals.length}\n
📱 Текущий тариф: ${capitalizeFirstLetter(user.tariff)}
		`;

		await ctx.reply(message, {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Пополнить баланс', callback_data: 'test' }],
					[{ text: 'Реферальная ссылка', callback_data: 'myRef' }]
				]
			}
		});
	} catch (error) {
		console.log('Error:', error);
	}
});

userProfile.action('myRef', ctx => {
	const userId = ctx.from.id;

	ctx.reply(`✉️ Приглашайте новых людей и получайте 50% с их депозита\n
Ваша реферальная ссылка: <code>https://t.me/shop_test_hjvfs2_bot?start=${userId}</code>`, {
		parse_mode: 'HTML'
	});
});

module.exports = { userProfile };