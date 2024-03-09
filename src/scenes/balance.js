const { Scenes } = require('telegraf');
const { BALANCE_SCENE, USER_PROFILE_SCENE } = require('../constants/scenes');
const { deleteLastMessage } = require('../utils/deleteLastMessage');

const balance = new Scenes.BaseScene(BALANCE_SCENE);

balance.enter(ctx => {
	ctx.reply('Выберите метод пополнения', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '💳 Карта', callback_data: 'cart' }],
				[{ text: '💰 Криптовалюты (в разработке)', callback_data: 'crypto' }],
				[{ text: '🔙 Назад', callback_data: 'cancel' }]
			],
			resize_keyboard: true
		}
	});
});

balance.action('crypto', ctx => {
	ctx.reply('Эта функция ещё в разработке');
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
});

balance.action('cart', ctx => {
	ctx.reply('Для оплаты картой свяжитесь с менеджером: @bybitsignals_0');
});

balance.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
});

module.exports = { balance };