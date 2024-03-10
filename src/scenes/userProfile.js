const { Scenes } = require('telegraf');
const { USER_PROFILE_SCENE, ADMIN_PANEL_SCENE, SUBSCRIPTION_SCENE, BALANCE_SCENE } = require('../constants/scenes');
const { User } = require('../database/models');
const { capitalizeFirstLetter } = require('../utils/capitalizeFirstLetter');
const { userRoles } = require('../constants/userRoles');
const { deleteLastMessage } = require('../utils/deleteLastMessage');
const { formatDateDifference } = require('../utils/formatDateDifference');

const userProfile = new Scenes.BaseScene(USER_PROFILE_SCENE);

userProfile.enter(async (ctx) => {
	const userId = ctx.from.id;
	const { role } = await User.findByPk(userId);
	const isUserAdmin = role === 'admin' || role === 'moderator';
	
	try {
		const user = await User.findOne({ where: { id: userId } });
		const currentTariff = user.tariff === 'none'
			? 'Відсутній'
			: `${capitalizeFirstLetter(user.tariff)} (закінчується через ${formatDateDifference(user.subExpiresAt)})`;

		const message = `
		📌 Ваш id: <code>${userId}</code> (Ви <b>${userRoles[role]}</b>)
💰 Баланс: ${Number(user.balance).toLocaleString('en-US')}$
👥 Кількість рефералів: ${user.referrals.length}\n
📱 Поточний тариф: ${currentTariff}
		`;

		await ctx.reply(message, {
			reply_markup: {
				inline_keyboard: [
					[{ text: '💰 Поповнити баланс', callback_data: 'balance' }],
					[{ text: '💳 Придбати підписку', callback_data: 'sub' }],
					[{ text: '🔄 Реферальне посилання', callback_data: 'myRef' }],
					isUserAdmin ? [{ text: '🛠️ Адмін панель', callback_data: 'admin_panel' }] : []
				]
			},
			parse_mode: 'HTML'
		});
	} catch (error) {
		console.log('Error:', error);
	}
});

userProfile.action('sub', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(SUBSCRIPTION_SCENE);
});

userProfile.action('balance', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(BALANCE_SCENE);
});

userProfile.action('admin_panel', async (ctx) => {
	const tgUserId = ctx.from.id;

	const { role } = await User.findByPk(tgUserId);
	const userHasPermission = role === 'admin' || role === 'moderator';

	if (userHasPermission) {
		deleteLastMessage(ctx);
		ctx.scene.enter(ADMIN_PANEL_SCENE);
	} else {
		ctx.reply('У вас немає доступу до цієї вкладки!');
	}
});

userProfile.action('myRef', ctx => {
	const userId = ctx.from.id;

	ctx.reply(`✉️ Запрошуйте нових людей і отримуйте 50% з їх депозиту\n
Ваше реферальне посилання: <code>https://t.me/shop_test_hjvfs2_bot?start=${userId}</code>`, {
		parse_mode: 'HTML'
	});
});

module.exports = { userProfile };