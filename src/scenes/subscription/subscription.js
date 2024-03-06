const { Scenes } = require('telegraf');
const { SUBSCRIPTION_SCENE, USER_PROFILE_SCENE } = require('../../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../../constants/subscriptions');
const { User } = require('../../database/models');
const { handleSubcription } = require('./handleSubcription');

const subscription = new Scenes.BaseScene(SUBSCRIPTION_SCENE);

subscription.enter(ctx => {
	ctx.reply(`
	<b>Подписка</b> — открывает доступ к трансляциям.
\n<b>*Ознакомиться с тарифами можно во вкладке 📖 Информация</b>`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Basic — $10/мес.', callback_data: BASIC.id }],
				[{ text: 'Advanced — $40/мес.', callback_data: ADVANCED.id }],
				[{ text: 'Premium — $70/мес.', callback_data: PREMIUM.id }],
			]
		},
		parse_mode: 'HTML'
	});
});

subscription.action(BASIC.id, async (ctx) => {
	await handleSubcription(ctx, BASIC.id, BASIC.price);
});

subscription.action(ADVANCED.id, async (ctx) => {
	await handleSubcription(ctx, ADVANCED.id, ADVANCED.price);
});

subscription.action(PREMIUM.id, async (ctx) => {
	await handleSubcription(ctx, PREMIUM.id, PREMIUM.price);
});

module.exports = { subscription };