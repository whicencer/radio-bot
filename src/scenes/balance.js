const { Scenes } = require('telegraf');
const { BALANCE_SCENE, USER_PROFILE_SCENE } = require('../constants/scenes');
const { deleteLastMessage } = require('../utils/deleteLastMessage');

const balance = new Scenes.BaseScene(BALANCE_SCENE);

balance.enter(ctx => {
	ctx.reply('Виберіть метод поповнення', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '💳 Карта', callback_data: 'cart' }],
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

balance.action('cart', ctx => {
	ctx.reply('Для оплати карткою зв\'яжіться з менеджером: НИК МЕНЕДЖЕРА');
});

balance.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
});

module.exports = { balance };