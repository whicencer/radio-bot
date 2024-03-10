const { Scenes } = require('telegraf');
const { INFORMATION_SCENE } = require('../constants/scenes');

const information = new Scenes.BaseScene(INFORMATION_SCENE);

information.enter(ctx => {
	ctx.reply('Інформація для користувачів:', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Зв\'язок з менеджером', url: 'google.com' }],
				[{ text: 'Тарифи та ціни', callback_data: 'price_list' }],
			]
		}
	});
});

information.action('price_list', ctx => {
	const firstTariff = `1. Тариф <b>Basic</b>: <u>$10/міс</u>\nТільки радіо. Можливість додати 2 канали\n\n`;
	const secondTariff = `2. Тариф <b>Advanced</b>: <u>$40/міс</u>\nТариф Basic + Youtube. Можливість додати 5 каналів\n\n`;
	const thirdTariff = `3. Тариф <b>Premium</b>: <u>$70/міс</u>\nВсі функції. Можливість додати 15 каналів\n`;
	const msg = firstTariff+secondTariff+thirdTariff;

	ctx.reply(msg, {
		parse_mode: 'HTML'
	});
});

module.exports = { information };