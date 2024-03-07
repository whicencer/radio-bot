const { Scenes } = require('telegraf');
const { User, Chat } = require('../../database/models');
const { CHAT_DETAILED_SCENE, CREATE_CHAT_SCENE, ALL_CHATS_SCENE, BROADCAST_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');

const allChats = new Scenes.BaseScene(ALL_CHATS_SCENE);

allChats.enter(async (ctx) => {
	const userId = ctx.from.id;

	const user = await User.findOne({ where: {id: userId}, include: 'chats'});
	const userChats = user.chats.sort((chat1, chat2) => chat1.createdAt - chat2.createdAt);
	const chatsBtns = userChats.map(chat => ([{ text: chat.name, callback_data: 'get_chat' + chat.id }]));

	await ctx.reply('💬 Ваши каналы', {
		reply_markup: {
			inline_keyboard: [
				...chatsBtns,
				[{ text: '➕ Добавить канал', callback_data: 'add_chat' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		}
	});
});

allChats.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(BROADCAST_SCENE);
});

allChats.action('add_chat', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(CREATE_CHAT_SCENE);
});

allChats.on('callback_query', async (ctx) => {
	const callbackData = ctx.callbackQuery.data;

	if (callbackData.startsWith('get_chat')) {
		const chatId = callbackData.replace('get_chat', '');
		deleteLastMessage(ctx);
		ctx.scene.enter(CHAT_DETAILED_SCENE, { chatId });
	}
});

module.exports = { allChats };