const { Scenes } = require('telegraf');
const { SUBSCRIPTION_SCENE, USER_PROFILE_SCENE } = require('../../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../../constants/subscriptions');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { handleSubcription } = require('./handleSubcription');
const { getLanguage } = require('../../utils/getLanguage');

const subscription = new Scenes.BaseScene(SUBSCRIPTION_SCENE);

subscription.enter(ctx => {
	ctx.reply(`
	<b>${getLanguage(ctx.session.lang, "Подписка")}</b> — ${getLanguage(ctx.session.lang, "открывает доступ к трансляциям.")}.
\n<b>*</b>${getLanguage(ctx.session.lang, "Ознакомиться с тарифами можно во вкладке 📖 Информация")}`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: `Basic — $10/${getLanguage(ctx.session.lang, "мес")}.`, callback_data: BASIC.id }],
				[{ text: `Advanced — $40/${getLanguage(ctx.session.lang, "мес")}.`, callback_data: ADVANCED.id }],
				[{ text: `Premium — $70/${getLanguage(ctx.session.lang, "мес")}.`, callback_data: PREMIUM.id }],
				[{ text: getLanguage(ctx.session.lang, "👤 Вернуться в профиль"), callback_data: 'back' }],
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