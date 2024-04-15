const { Scenes } = require('telegraf');
const { BROADCAST_SCENE, ALL_CHATS_SCENE, LIBRARY_SCENE } = require('../constants/scenes');
const { deleteLastMessage } = require('../utils/deleteLastMessage');
const { getLanguage } = require('../utils/getLanguage');

const broadcastScene = new Scenes.BaseScene(BROADCAST_SCENE);

broadcastScene.enter(async (ctx) => {
	ctx.reply(getLanguage(ctx.session.lang, "Тут вы сможете настроить свою трансляцию"), {
		reply_markup: {
			inline_keyboard: [
				[{ text: `💬 ${getLanguage(ctx.session.lang, "Каналы")}`, callback_data: 'chats' }],
				[{ text: `📀 ${getLanguage(ctx.session.lang, "Библиотека")}`, callback_data: 'library' }]
			]
		}
	});
});

broadcastScene.action('chats', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ALL_CHATS_SCENE);
});

broadcastScene.action('library', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(LIBRARY_SCENE);
});

module.exports = { broadcastScene };