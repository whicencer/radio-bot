const { Scenes } = require('telegraf');
const { MAIN_SCENE } = require('../constants/scenes');

const main = new Scenes.BaseScene(MAIN_SCENE);

main.enter(ctx => {
	const username = ctx.from.first_name;

	ctx.reply(`Приветствую тебя, ${username}!`, {
		reply_markup: {
			keyboard: [
				[{ text: '👤 Профиль' }, { text: '📖 Инструкция' }],
				[{ text: '📡 Транслировать' }]
			],
			resize_keyboard: true
		}
	});
});

module.exports = { main };