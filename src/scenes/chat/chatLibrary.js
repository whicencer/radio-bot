const { Scenes } = require('telegraf');
const { CHAT_LIBRARY_SCENE, CHAT_DETAILED_SCENE, ADD_CHAT_LIBRARY_SOURCE_SCENE, CHAT_LIBRARY_SOURCE_SCENE } = require('../../constants/scenes');
const { Chat } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');

const chatLibrary = new Scenes.BaseScene(CHAT_LIBRARY_SCENE);

chatLibrary.enter(async (ctx) => {
	const chatId = ctx.scene.state.chatId;
	const chat = await Chat.findOne({ where: {id: chatId}, include: 'resources' });
	const chatResources = chat.resources.map(resource => [{text: `🎧 ${resource.name}`, callback_data: `source ${resource.id}`}]);

	ctx.reply(`Бібліотека каналу: <b>${chat.name}</b>`, {
		reply_markup: {
			inline_keyboard: [
				...chatResources,
				[{ text: '➕ Додати ресурс', callback_data: 'add_source' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		},
		parse_mode: 'HTML'
	});
});

chatLibrary.action('back', ctx => {
	const chatId = ctx.scene.state.chatId;
	deleteLastMessage(ctx);
	ctx.scene.enter(CHAT_DETAILED_SCENE, { chatId });
});

chatLibrary.action('add_source', async (ctx) => {
	const chatId = ctx.scene.state.chatId;
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_CHAT_LIBRARY_SOURCE_SCENE, { chatId });
});

chatLibrary.on('callback_query', async (ctx) => {
	const callbackData = ctx.callbackQuery.data;
	const chatId = ctx.scene.state.chatId;

	if (callbackData.startsWith('source')) {
		const sourceId = callbackData.replace('source', '');

		try {
			deleteLastMessage(ctx);
			ctx.scene.enter(CHAT_LIBRARY_SOURCE_SCENE, { chatId, sourceId });
		} catch (error) {
			console.log(error);
			ctx.reply('❌ Виникла помилка під час видалення ресурсу');
		}
	}
});

module.exports = { chatLibrary };