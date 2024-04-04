const { Scenes } = require('telegraf');
const { ADD_CHAT_LIBRARY_SOURCE_SCENE, CHAT_LIBRARY_SCENE, CHAT_DETAILED_SCENE, LIBRARY_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { Resource, Chat } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addChatLibrarySource = new Scenes.BaseScene(ADD_CHAT_LIBRARY_SOURCE_SCENE);

addChatLibrarySource.enter(async (ctx) => {
	const userId = ctx.from.id;
	
	try {
		const resources = await Resource.findAll({ where: {userId} });
		const resourceButtons = resources.map(resource => ([{text: `🎧 ${resource.name}`, callback_data: `add_source ${resource.id}`}]));

		ctx.reply(`Виберіть ресурс, який хочете додати
	${resources.length < 1 ? 'У вас немає ресурсів' : ''}`, {
			reply_markup: {
				inline_keyboard: [
					...resourceButtons,
					[{ text: 'Перейти до загальної бібліотеки', callback_data: 'go_main_lib' }],
					[{ text: '⬅️ Назад', callback_data: 'back' }]
				]
			}
		});
	} catch (error) {
		console.log("Произошла ошибка при получении ресурсов: ", error);
	}
});

addChatLibrarySource.action('go_main_lib', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(LIBRARY_SCENE);
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
			
			const msg = await ctx.reply('✅ Ресурс було успішно додано до каналу!');
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			console.log(error);
			ctx.reply('❌ Виникла помилка під час додавання ресурсу');
		} finally {
			deleteLastMessage(ctx);
			ctx.scene.enter(CHAT_DETAILED_SCENE, { chatId });
		}
	}
});

module.exports = { addChatLibrarySource };