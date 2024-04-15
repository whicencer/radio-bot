const { Scenes } = require('telegraf');
const { MAIN_SCENE } = require('../constants/scenes');
const { getLanguage } = require('../utils/getLanguage');

const main = new Scenes.BaseScene(MAIN_SCENE);

main.enter(ctx => {
	const username = ctx.from.first_name;

	ctx.reply(`${getLanguage(ctx.session.lang, "Добро пожаловать")}, ${username}!`, {
		reply_markup: {
			keyboard: [
				[{ text: getLanguage(ctx.session.lang, "👤 Профиль") }, { text: getLanguage(ctx.session.lang, "📖 Информация") }],
				[{ text: getLanguage(ctx.session.lang, "📡 Транслировать") }]
			],
			resize_keyboard: true
		}
	});
});

module.exports = { main };