const { Scenes } = require('telegraf');
const { BALANCE_SCENE, USER_PROFILE_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { createInvoice } = require('../../payments/card/createInvoice');
const { checkPayments } = require('../balance/helpers/checkPayments');

const balance = new Scenes.BaseScene(BALANCE_SCENE);

balance.enter(ctx => {
	ctx.reply('Виберіть метод поповнення', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '💳 Карта', callback_data: 'card' }],
				[{ text: '💰 Криптовалюти (у розробці)', callback_data: 'crypto' }],
				[{ text: '🔙 Назад', callback_data: 'cancel' }]
			],
			resize_keyboard: true
		}
	});
});

balance.action('crypto', ctx => {
	ctx.reply('Ця функція ще у розробці');
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
});

balance.action('card', ctx => {
	ctx.reply('Введіть суму поповнення у доларах', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
			]
		}
	});
	ctx.scene.session.stage = 1;
});

balance.on('message', async (ctx) => {
	const msgText = ctx.message.text;

	if (ctx.scene.session.stage === 1) {
		const sum = Number(msgText);

		if (isNaN(sum)) {
			ctx.reply('Невірна сума поповнення');
		} else {
			const { invoiceUrl, orderReference } = await createInvoice(sum, ctx.from.id);
			ctx.scene.session.orderReference = orderReference;
			ctx.scene.session.sum = sum;

			ctx.reply('Ваше посилання на оплату (дiйсне 10 хвилин)👇', {
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Оплатити', url: invoiceUrl }]
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