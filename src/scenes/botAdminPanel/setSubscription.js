const { Scenes } = require('telegraf');
const { ADMIN_SET_USER_SUBSCRIPTION, ADMIN_MANAGE_USERS_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');
const { BASIC, ADVANCED, PREMIUM, NONE } = require('../../constants/subscriptions');
const { daysToMilliseconds } = require('../../utils/daysToMilliseconds');

const setSubscription = new Scenes.BaseScene(ADMIN_SET_USER_SUBSCRIPTION);

setSubscription.enter(ctx => {
	ctx.reply('Виберіть тариф, який хочете видати', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Basic', callback_data: BASIC.id }],
				[{ text: 'Advanced', callback_data: ADVANCED.id }],
				[{ text: 'Premium', callback_data: PREMIUM.id }],
				[{ text: 'Забрати підписку', callback_data: NONE }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		}
	});
});

setSubscription.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
});

setSubscription.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
});

setSubscription.on('callback_query', ctx => {
	const callbackData = ctx.callbackQuery.data;

	if (callbackData !== 'back') {
		ctx.scene.session.stage = 2;
		ctx.scene.session.tariff = callbackData;

		ctx.reply('Введіть ID користувача, якому хочете видати підписку', {
			reply_markup: {
				inline_keyboard: [
					[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
				]
			}
		});
	}
});

setSubscription.on('message', async (ctx) => {
	const msgText = ctx.message.text;

	if (ctx.scene.session.stage === 2) {
		ctx.scene.session.userId = msgText;

		try {
			const user = await User.findByPk(msgText);
			const tariff = ctx.scene.session.tariff;

			if (tariff === 'none') {
				await user.update({ tariff });
				ctx.reply(`Ви забрали підписку у ID ${ctx.scene.session.userId}.`);
				ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
			} else {
				if (!user) {
					ctx.reply(`Користувача з ID ${msgText} не було знайдено в базі даних бота.`);
				} else {
					ctx.reply('Введіть строк, на який ви хочете надати підписку (у днях)', {
						reply_markup: {
							inline_keyboard: [
								[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
							]
						}
					});
					ctx.scene.session.stage = 3;
				}
			}
		} catch (error) {
			ctx.reply(`При виконанні запиту виникла помилка.`);
			console.log('Error while setting subscription: ', error);
		}
	} else if (ctx.scene.session.stage === 3) {
		const tariff = ctx.scene.session.tariff;
		const days = ctx.message.text;
		const userId = ctx.scene.session.userId;

		if (!isNaN(Number(days))) {
			try {
				await User.update({ tariff, subExpiresAt: new Date(Date.now() + daysToMilliseconds(days)) }, { where: { id: userId } });
				ctx.reply(`Тариф ${tariff} було успішно видано на ${days} днів користувачу з ID ${userId}.`);
				ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
			} catch (error) {
				ctx.reply('Помилка при підключенні тарифу.');
				console.log('Error while setting subscription: ', error);
			}
		}
	}
});

module.exports = { setSubscription };