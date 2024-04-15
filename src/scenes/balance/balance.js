const { Scenes } = require('telegraf');
const { BALANCE_SCENE, USER_PROFILE_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { createInvoice } = require('../../payments/card/createInvoice');
const { checkPayments } = require('../balance/helpers/checkPayments');
const { getLanguage } = require('../../utils/getLanguage');

const balance = new Scenes.BaseScene(BALANCE_SCENE);

balance.enter(ctx => {
	ctx.reply(getLanguage(ctx.session.lang, "Выберите метод пополнения"), {
		reply_markup: {
			inline_keyboard: [
				[{ text: `💳 ${getLanguage(ctx.session.lang, "Карта")}`, callback_data: 'card' }],
				[{ text: `💰 ${getLanguage(ctx.session.lang, "Криптовалюты")}`, callback_data: 'crypto' }],
				[{ text: `🔙 ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'cancel' }]
			],
			resize_keyboard: true
		}
	});
});

balance.action('crypto', ctx => {
	ctx.reply(`${getLanguage(ctx.session.lang, "Для оплаты пишите менеджеру")}: @nastyaa_manag`);
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
});

balance.action('card', ctx => {
	ctx.reply(`${getLanguage(ctx.session.lang, "Для оплаты пишите менеджеру")}: @nastyaa_manag`);
	ctx.scene.enter(USER_PROFILE_SCENE);
	// ctx.reply('Введіть суму поповнення у доларах', {
	// 	reply_markup: {
	// 		inline_keyboard: [
	// 			[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
	// 		]
	// 	}
	// });
	// ctx.scene.session.stage = 1;
});

balance.on('message', async (ctx) => {
	const msgText = ctx.message.text;

	if (ctx.scene.session.stage === 1) {
		const sum = Number(msgText);

		if (isNaN(sum)) {
			ctx.reply(getLanguage(ctx.session.lang, "Неверная сумма пополнения"));
		} else {
			ctx.scene.session.stage = 2;
			const { invoiceUrl, orderReference } = await createInvoice(sum, ctx.from.id);
			ctx.scene.session.orderReference = orderReference;
			ctx.scene.session.sum = sum;

			ctx.reply(getLanguage(ctx.session.lang, "Ваша ссылка на оплату (действительно 10 минут)👇"), {
				reply_markup: {
					inline_keyboard: [
						[{ text: getLanguage(ctx.session.lang, "Оплатить"), url: invoiceUrl }]
					]
				}
			});
			
			await checkPayments(ctx, ctx.scene.session.sum, ctx.scene.session.orderReference);
		}
	}
});

balance.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
});

module.exports = { balance };