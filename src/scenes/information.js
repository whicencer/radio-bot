const { Scenes } = require('telegraf');
const { INFORMATION_SCENE } = require('../constants/scenes');

const information = new Scenes.BaseScene(INFORMATION_SCENE);
const navigationMsg = `<b>Загальні кнопки:</b>
<code>
👤 Профіль — Ваш профіль
📖 Інформація — Інформація для користувачів
📡 Транслювати — Меню трансляцій
</code>

<b>Меню трансляцій:</b>
<code>
💬 Канали — Ваші канали
📀 Бібліотека — Загальна бібліотека
</code>`;

information.enter(ctx => {
	ctx.reply(navigationMsg, {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Зв\'язок з менеджером', url: 'https://t.me/nastyaa_manag' }],
				[{ text: 'Тарифи та ціни', callback_data: 'price_list' }],
			]
		},
		parse_mode: 'HTML'
	});
});

information.action('price_list', ctx => {
	const firstTariff = `1. Тариф Basic: $10/міс\nТільки радіо. Можливість одночасного транслювання у 1 каналі.\n\n`;
	const secondTariff = `2. Тариф Advanced: $40/міс\nТариф Basic + Youtube. Можливість одночасного транслювання у 2-х каналах.\n\n`;
	const thirdTariff = `3. Тариф Premium: $70/міс\nВсі функції. Можливість одночасного транслювання у 4-х каналах.\n`;
	const msg = firstTariff+secondTariff+thirdTariff;

	ctx.reply(msg, {
		parse_mode: 'HTML'
	});
});

module.exports = { information };