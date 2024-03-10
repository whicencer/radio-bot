const { Scenes } = require('telegraf');
const { MAIN_SCENE } = require('../constants/scenes');

const main = new Scenes.BaseScene(MAIN_SCENE);

main.enter(ctx => {
	const username = ctx.from.first_name;

	ctx.reply(`Ласкаво просимо, ${username}!`, {
		reply_markup: {
			keyboard: [
				[{ text: '👤 Профіль' }, { text: '📖 Інформація' }],
				[{ text: '📡 Транслювати' }]
			],
			resize_keyboard: true
		}
	});
});

module.exports = { main };