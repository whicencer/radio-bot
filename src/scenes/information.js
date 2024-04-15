const { Scenes } = require('telegraf');
const { INFORMATION_SCENE } = require('../constants/scenes');
const { getLanguage } = require('../utils/getLanguage');

const information = new Scenes.BaseScene(INFORMATION_SCENE);

information.enter(ctx => {
	const navigationMsg = `<b>${getLanguage(ctx.session.lang, "Общие кнопки")}:</b>
	<code>
	${getLanguage(ctx.session.lang, "👤 Профиль — Ваш профиль")}
	${getLanguage(ctx.session.lang, "📖 Информация - Информация для пользователей")}
	${getLanguage(ctx.session.lang, "📡 Транслировать - Меню трансляций")}
	</code>
	
	<b>${getLanguage(ctx.session.lang, "Меню трансляций")}:</b>
	<code>
	${getLanguage(ctx.session.lang, "💬 Каналы - Ваши каналы")}
	${getLanguage(ctx.session.lang, "📀 Библиотека - Общая библиотека")}
	</code>`;
	
	ctx.reply(navigationMsg, {
		reply_markup: {
			inline_keyboard: [
				[{ text: getLanguage(ctx.session.lang, "Связь с менеджером"), url: 'https://t.me/nastyaa_manag' }],
				[{ text: getLanguage(ctx.session.lang, "Тарифы и цены"), callback_data: 'price_list' }],
			]
		},
		parse_mode: 'HTML'
	});
});

information.action('price_list', ctx => {
	const firstTariff = `1. Basic: $10/${getLanguage(ctx.session.lang, "мес")}\n${getLanguage(ctx.session.lang, "Только радио. Возможность одновременного транслирования в 1 канале")}\n\n`;
	const secondTariff = `2. Advanced: $40/${getLanguage(ctx.session.lang, "мес")}\n${getLanguage(ctx.session.lang, "Тариф Basic + Youtube. Возможность одновременного транслирования в 2-х каналах")}\n\n`;
	const thirdTariff = `3. Premium: $70/${getLanguage(ctx.session.lang, "мес")}\n${getLanguage(ctx.session.lang, "Все функции. Возможность одновременного транслирования в 4-х каналах")}\n`;
	const msg = firstTariff+secondTariff+thirdTariff;

	ctx.reply(msg, {
		parse_mode: 'HTML'
	});
});

module.exports = { information };