const { Scenes } = require('telegraf');
const { USER_PROFILE_SCENE, ADMIN_PANEL_SCENE } = require('../constants/scenes');
const { User } = require('../database/models');
const { capitalizeFirstLetter } = require('../utils/capitalizeFirstLetter');

const userProfile = new Scenes.BaseScene(USER_PROFILE_SCENE);

userProfile.enter(async (ctx) => {
	const userId = ctx.message.from.id;
	const { role } = await User.findByPk(userId);
	const isUserAdmin = role === 'admin';

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
					[{ text: '💰 Пополнить баланс', callback_data: 'test' }],
					[{ text: '🔄 Реферальная ссылка', callback_data: 'myRef' }],
					isUserAdmin ? [{ text: '🛠️ Админ панель', callback_data: 'admin_panel' }] : []
				]
			}
		});
	} catch (error) {
		console.log('Error:', error);
	}
});

userProfile.action('admin_panel', async (ctx) => {
	const tgUserId = ctx.from.id;

	const { role } = await User.findByPk(tgUserId);
	const userHasPermission = role === 'admin';

	if (userHasPermission) {
		ctx.scene.enter(ADMIN_PANEL_SCENE);
	} else {
		ctx.reply('У вас нет доступа к этой вкладке!');
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