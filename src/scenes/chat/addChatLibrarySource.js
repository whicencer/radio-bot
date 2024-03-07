const { Scenes } = require('telegraf');
const { ADD_CHAT_LIBRARY_SOURCE_SCENE, CHAT_LIBRARY_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { Resource, Chat } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addChatLibrarySource = new Scenes.BaseScene(ADD_CHAT_LIBRARY_SOURCE_SCENE);

addChatLibrarySource.enter(async (ctx) => {
	const userId = ctx.from.id;
	const resources = await Resource.findAll({ where: {userId} });
	const resourceButtons = resources.map(resource => ([{text: `🎧 ${resource.name}`, callback_data: `add_source ${resource.id}`}]));

	ctx.reply('Выберите ресурс, который хотите добавить', {
		reply_markup: {
			inline_keyboard: [
				...resourceButtons,
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		}
	});
});

addChatLibrarySource.action('back', ctx => {
	const chatId = ctx.scene.state.chatId;

	deleteLastMessage(ctx);
	ctx.scene.enter(CHAT_LIBRARY_SCENE, { chatId });
});

addChatLibrarySource.on('callback_query', async (ctx) => {
	const callbackData = ctx.callbackQuery.data;
	const chatId = ctx.scene.state.chatId;

	if (callbackData.startsWith('add_source')) {
		const resourceId = callbackData.replace('add_source', '');
		
		try {
			const chat = await Chat.findOne({where: {id: chatId}});
			const currentResource = await Resource.findOne({where: {id: resourceId}});
			chat.addResource(currentResource);

			
			const msg = await ctx.reply('✅ Ресурс был успешно добавлен в канал!');
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			console.log(error);
			ctx.reply('❌ Возникла ошибка во время добавления ресурса');
		} finally {
			deleteLastMessage(ctx);
			ctx.scene.enter(CHAT_LIBRARY_SCENE, { chatId });
		}
	}
});

module.exports = { addChatLibrarySource };