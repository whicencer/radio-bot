const { Scenes } = require('telegraf');
const { ADMIN_MANAGE_USERS_SCENE, ADMIN_TOPUP_USER_BALANCE_SCENE, ADMIN_PANEL_SCENE, ADMIN_SET_USER_SUBSCRIPTION, ADMIN_SET_REF_BONUS_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { getLanguage } = require('../../utils/getLanguage');

const manageUsers = new Scenes.BaseScene(ADMIN_MANAGE_USERS_SCENE);

manageUsers.enter(ctx => {
	ctx.reply(getLanguage(ctx.session.lang, "Панель управления пользователями"), {
		reply_markup: {
			inline_keyboard: [
				[{ text: `💰 ${getLanguage(ctx.session.lang, "Пополнить баланс")}`, callback_data: 'topUpBalance' }],
				[{ text: `💳 ${getLanguage(ctx.session.lang, "Установить тариф")}`, callback_data: 'setSubscription' }],
				[{ text: `💲 ${getLanguage(ctx.session.lang, "Установить реферальный бонус")}`, callback_data: 'setRefBonus' }],
				[{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }]
			]
		}
	});
});

manageUsers.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_PANEL_SCENE);
});

manageUsers.action('setSubscription', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_SET_USER_SUBSCRIPTION);
});

manageUsers.action('topUpBalance', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_TOPUP_USER_BALANCE_SCENE);
});

manageUsers.action('setRefBonus', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_SET_REF_BONUS_SCENE);
});

module.exports = { manageUsers };