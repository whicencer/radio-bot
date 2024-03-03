const { Scenes } = require('telegraf');
const { ADMIN_SET_USER_SUBSCRIPTION, ADMIN_MANAGE_USERS_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');
const { BASIC, ADVANCED, PREMIUM, NONE } = require('../../constants/subscriptions');

const setSubscription = new Scenes.BaseScene(ADMIN_SET_USER_SUBSCRIPTION);

setSubscription.enter(ctx => {
	ctx.reply('Выберите тариф который хотите выдать', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Basic', callback_data: BASIC.id }],
				[{ text: 'Advanced', callback_data: ADVANCED.id }],
				[{ text: 'Premium', callback_data: PREMIUM.id }],
				[{ text: 'Забрать подписку', callback_data: NONE }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		}
	});
});

setSubscription.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
});

setSubscription.on('callback_query', ctx => {
	const callbackData = ctx.callbackQuery.data;

	if (callbackData !== 'back') {
		ctx.scene.session.stage = 2;
		ctx.scene.session.tariff = callbackData;

		ctx.reply('Введите ID пользователя которому хотите выдать подписку');
	}
});

setSubscription.on('message', async (ctx) => {
	const msgText = ctx.message.text;

	if (ctx.scene.session.stage === 2) {
		const tariff = ctx.scene.session.tariff;

		try {
			const user = await User.findByPk(msgText);

			if (!user) {
				ctx.reply(`Пользователь с ID ${msgText} не был найден в базе данных бота`);
			} else {
				user.update({ tariff });
				ctx.reply(`Тариф ${tariff} был успешно выдан пользователю с ID ${msgText}`);
			}

		} catch (error) {
			ctx.reply('Произошла ошибка при выдаче подписки');
		} finally {
			ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
		}
	}
});

module.exports = { setSubscription };