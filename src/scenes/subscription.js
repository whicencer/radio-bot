const { Scenes } = require('telegraf');
const { SUBSCRIPTION_SCENE } = require('../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../constants/subscriptions');
const { User } = require('../database/models');

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
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);

	if (user.balance < BASIC.price) {
		ctx.reply('У вас недостаточно денег на балансе');
	} else {
		const date = new Date();
		date.setMonth(date.setMonth() + 1);
		user.update({ tariff: BASIC.id, subExpiresAt: date });
		user.decrement('balance', { by: 10, where: { id: userId } });
		ctx.reply('Вы подключили тариф Basic на месяц!');
	}
});

module.exports = { subscription };