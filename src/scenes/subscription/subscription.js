const { Scenes } = require('telegraf');
const { SUBSCRIPTION_SCENE, USER_PROFILE_SCENE } = require('../../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../../constants/subscriptions');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { handleSubcription } = require('./handleSubcription');

const subscription = new Scenes.BaseScene(SUBSCRIPTION_SCENE);

subscription.enter(ctx => {
	ctx.reply(`
	<b>Підписка</b> — відкриває доступ до трансляцій.
\n<b>*Ознайомитися з тарифами можна в розділі 📖 Інформація</b>`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Basic — $10/мес.', callback_data: BASIC.id }],
				[{ text: 'Advanced — $40/мес.', callback_data: ADVANCED.id }],
				[{ text: 'Premium — $70/мес.', callback_data: PREMIUM.id }],
				[{ text: '👤 Повернутися до профілю', callback_data: 'back' }],
			]
		},
		parse_mode: 'HTML'
	});
});

subscription.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
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