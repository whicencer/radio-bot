const { Scenes } = require('telegraf');
const { SUBSCRIPTION_SCENE } = require('../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../constants/subscriptions');
const { User } = require('../database/models');

const subscription = new Scenes.BaseScene(SUBSCRIPTION_SCENE);

subscription.enter(ctx => {
	ctx.reply('Для начала подключите подписку!\n\n<b>*Ознакомиться с тарифами можно во вкладке 📖 Информация</b>', {
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
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);

	if (user.balance < BASIC.price) {
		ctx.reply('У вас недостаточно денег на балансе');
	} else {
		console.log('Подписка');
		user.decrement('balance', { by: 10, where: { id: userId } });
	}
});

module.exports = { subscription };