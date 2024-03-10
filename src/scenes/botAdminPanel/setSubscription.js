const { Scenes } = require('telegraf');
const { ADMIN_SET_USER_SUBSCRIPTION, ADMIN_MANAGE_USERS_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');
const { BASIC, ADVANCED, PREMIUM, NONE } = require('../../constants/subscriptions');

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

setSubscription.on('callback_query', ctx => {
	const callbackData = ctx.callbackQuery.data;

	if (callbackData !== 'back') {
		ctx.scene.session.stage = 2;
		ctx.scene.session.tariff = callbackData;

		ctx.reply('Введіть ID користувача, якому хочете видати підписку');
	}
});

setSubscription.on('message', async (ctx) => {
	const msgText = ctx.message.text;

	if (ctx.scene.session.stage === 2) {
		const tariff = ctx.scene.session.tariff;

		try {
			const user = await User.findByPk(msgText);

			if (!user) {
				ctx.reply(`Користувача з ID ${msgText} не було знайдено в базі даних бота.`);
			} else {
				user.update({ tariff });
				ctx.reply(`Тариф ${tariff} було успішно видано користувачу з ID ${msgText}.`);
			}

		} catch (error) {
			ctx.reply('Сталася помилка при видачі підписки.');
		} finally {
			ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
		}
	}
});

module.exports = { setSubscription };