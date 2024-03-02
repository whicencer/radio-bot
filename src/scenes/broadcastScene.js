const { Scenes } = require('telegraf');
const { NONE } = require('../constants/subscriptions');
const { BROADCAST_SCENE, ALL_CHATS_SCENE, LIBRARY_SCENE, SUBSCRIPTION_SCENE } = require('../constants/scenes');
const { deleteLastMessage } = require('../utils/deleteLastMessage');
const { User } = require('../database/models');

const broadcastScene = new Scenes.BaseScene(BROADCAST_SCENE);

broadcastScene.enter(async (ctx) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);

	if (user.tariff === NONE) {
		ctx.scene.enter(SUBSCRIPTION_SCENE);
	} else {
		ctx.reply('Здесь вы сможете настроить свою трансляцию', {
			reply_markup: {
				inline_keyboard: [
					[{ text: '💬 Чаты', callback_data: 'chats' }],
					[{ text: '📀 Библиотека', callback_data: 'library' }]
				]
			}
		});
	}
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