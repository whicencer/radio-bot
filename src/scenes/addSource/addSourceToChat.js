const { Scenes } = require('telegraf');
const { ADD_SOURCE_TO_CHAT_SCENE, CHAT_DETAILED_SCENE, LIBRARY_SCENE } = require('../../constants/scenes');
const { User, Chat } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addSourceToChat = new Scenes.BaseScene(ADD_SOURCE_TO_CHAT_SCENE);

addSourceToChat.enter(async (ctx) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId, { include: 'chats' });
	const userChats = user.chats.sort((chat1, chat2) => chat1.createdAt - chat2.createdAt);
	const chatsBtns = userChats.map(chat => ([{ text: chat.name, callback_data: 'to_chat' + chat.id }]));

	ctx.reply('Выберите канал в который хотите добавить ресурс:', {
		reply_markup: {
			inline_keyboard: [
				...chatsBtns,
				[{ text: 'Вернуться в библиотеку', callback_data: 'cancel' }]
			]
		}
	});
});

addSourceToChat.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(LIBRARY_SCENE);
});

addSourceToChat.on('callback_query', async (ctx) => {
	const createdSource = ctx.scene.state.createdSource;
	const chatId = ctx.callbackQuery.data.split('to_chat')[1];
	
	try {
		const chat = await Chat.findByPk(chatId);
		chat.addResource(createdSource);

		const msg = await ctx.reply('✅ Ресурс был успешно добавлен в канал!');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);

		ctx.scene.enter(CHAT_DETAILED_SCENE, { chatId });
		deleteLastMessage(ctx);
	} catch (error) {
		console.log(error);
		ctx.reply(`❌ Возникла ошибка при добавлении ресурса в канал: ${error?.message}`);
	}
});

module.exports = { addSourceToChat };