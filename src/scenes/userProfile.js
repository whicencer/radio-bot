const { Scenes } = require('telegraf');
const { USER_PROFILE_SCENE, ADMIN_PANEL_SCENE, SUBSCRIPTION_SCENE, BALANCE_SCENE } = require('../constants/scenes');
const { User } = require('../database/models');
const { userRoles } = require('../constants/userRoles');
const { deleteLastMessage } = require('../utils/deleteLastMessage');
const { getUserTariff } = require('../utils/getUserTariff');
const { hasAdminPermission } = require('../middleware/hasAdminPermission');
const { getLanguage } = require('../utils/getLanguage');

const userProfile = new Scenes.BaseScene(USER_PROFILE_SCENE);

userProfile.enter(async (ctx) => {
	const userId = ctx.from.id;
	const { role } = await User.findByPk(userId);
	const isUserAdmin = role === 'admin' || role === 'moderator';
	
	try {
		const user = await User.findOne({ where: { id: userId } });
		const currentTariff = getUserTariff(user.tariff, user.subExpiresAt, ctx.session.lang);

		const message = `
		📌 ${getLanguage(ctx.session.lang, "Ваш id")}: <code>${userId}</code> (<b>${userRoles[role]}</b>)
💰 ${getLanguage(ctx.session.lang, "Баланс")}: ${Number(user.balance).toLocaleString('en-US')}$
👥 ${getLanguage(ctx.session.lang, "Количество рефералов")}: ${user.referrals.length}\n
📱 ${getLanguage(ctx.session.lang, "Текущий тариф")}: ${currentTariff}
		`;

		await ctx.reply(message, {
			reply_markup: {
				inline_keyboard: [
					[{ text: `💰 ${getLanguage(ctx.session.lang, "Пополнить баланс")}`, callback_data: 'balance' }],
					[{ text: `💳 ${getLanguage(ctx.session.lang, "Приобрести подписку")}`, callback_data: 'sub' }],
					[{ text: `🔄 ${getLanguage(ctx.session.lang, "Реферальная ссылка")}`, callback_data: 'myRef' }],
					isUserAdmin ? [{ text: `🛠️ ${getLanguage(ctx.session.lang, "Админ панель")}`, callback_data: 'admin_panel' }] : []
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

userProfile.action('admin_panel', hasAdminPermission, ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_PANEL_SCENE);
});

userProfile.action('myRef', ctx => {
	const userId = ctx.from.id;

	ctx.reply(`✉️ ${getLanguage(ctx.session.lang, "Приглашайте новых людей и получайте 30% с их депозита")}\n
${getLanguage(ctx.session.lang, "Ваша реферальная ссылка")}: <code>${process.env.BOT_URL}${userId}</code>`, {
		parse_mode: 'HTML'
	});
});

module.exports = { userProfile };