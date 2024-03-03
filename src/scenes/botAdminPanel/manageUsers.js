const { Scenes } = require('telegraf');
const { ADMIN_MANAGE_USERS_SCENE, ADMIN_TOPUP_USER_BALANCE_SCENE, ADMIN_PANEL_SCENE, ADMIN_SET_USER_SUBSCRIPTION } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');

const manageUsers = new Scenes.BaseScene(ADMIN_MANAGE_USERS_SCENE);

manageUsers.enter(ctx => {
	ctx.reply('Панель управления пользователями', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '💰 Пополнить баланс', callback_data: 'topUpBalance' }],
				[{ text: '💳 Установить тариф', callback_data: 'setSubscription' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
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

module.exports = { manageUsers };