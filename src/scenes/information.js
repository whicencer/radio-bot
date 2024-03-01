const { Scenes } = require('telegraf');
const { INFORMATION_SCENE } = require('../constants/scenes');

const information = new Scenes.BaseScene(INFORMATION_SCENE);

information.enter(ctx => {
	ctx.reply('Информация для пользователей:', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Связь с менеджером', url: 'google.com' }],
				[{ text: 'Тарифы и цены', callback_data: 'price_list' }],
			]
		}
	});
});

information.action('price_list', ctx => {
	const firstTariff = `1. Тариф <b>Basic</b>: <u>$10/мес</u>\nТолько радио. Возможность добавить 2 канала\n\n`;
	const secondTariff = `2. Тариф <b>Advanced</b>: <u>$40/мес</u>\nТариф Basic + Youtube. Возможность добавить 5 каналов\n\n`;
	const thirdTariff = `3. Тариф <b>Premium</b>: <u>$70/мес</u>\nВсе функции. Возможность добавить 15 каналов\n`;
	const msg = firstTariff+secondTariff+thirdTariff;

	ctx.reply(msg, {
		parse_mode: 'HTML'
	});
});

module.exports = { information };