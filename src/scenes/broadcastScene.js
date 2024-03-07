const { Scenes } = require('telegraf');
const { BROADCAST_SCENE, ALL_CHATS_SCENE, LIBRARY_SCENE } = require('../constants/scenes');
const { deleteLastMessage } = require('../utils/deleteLastMessage');

const broadcastScene = new Scenes.BaseScene(BROADCAST_SCENE);

broadcastScene.enter(async (ctx) => {
	ctx.reply('Здесь вы сможете настроить свою трансляцию', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '💬 Каналы', callback_data: 'chats' }],
				[{ text: '📀 Библиотека', callback_data: 'library' }]
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