const { Scenes } = require('telegraf');
const { LIBRARY_SCENE, BROADCAST_SCENE, LIBRARY_SOURCE_SCENE, ADD_SOURCE_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');

const library = new Scenes.BaseScene(LIBRARY_SCENE);

library.enter(async (ctx) => {
	const userId = ctx.from.id;

	const user = await User.findOne({ where: {id: userId}, include: 'resources' });
	const resourcesBtns = user.resources.map(resource => ([{ text: `🎧 ${resource.name}`, callback_data: 'get_source' + resource.id }]));

	ctx.reply('📀 Ваша библиотека', {
		reply_markup: {
			inline_keyboard: [
				...resourcesBtns,
				[{ text: '➕ Добавить ресурс', callback_data: 'add_source' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		}
	});
});

library.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(BROADCAST_SCENE);
});

library.action('add_source', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_SOURCE_SCENE);
});

library.on('callback_query', async (ctx) => {
	const callbackData = ctx.callbackQuery.data;

	if (callbackData.startsWith('get_source')) {
		const sourceId = callbackData.replace('get_source', '');
		deleteLastMessage(ctx);
		ctx.scene.enter(LIBRARY_SOURCE_SCENE, { sourceId });
	}
});

module.exports = { library };