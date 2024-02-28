const { Scenes } = require('telegraf');
const { Chat } = require('../../database/models');
const { ALL_CHATS_SCENE, CHAT_DETAILED_SCENE, CHAT_LIBRARY_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');

const chatDetailed = new Scenes.BaseScene(CHAT_DETAILED_SCENE);

chatDetailed.enter(async (ctx) => {
	const chatId = ctx.scene.state.chatId;
	const chat = await Chat.findOne({ where: {id: chatId} });
	
	ctx.reply(`<b>Чат: <code>${chat.name}</code></b>\n<b>Ссылка на чат: ${chat.chatLink}</b>`, {
		reply_markup: {
			inline_keyboard: [
				// [changeStatusButton],
				[{ text: '🎥 Библиотека эфира', callback_data: `chat_library` }],
				[{ text: '❌ Удалить чат', callback_data: 'delete_chat' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		},
		parse_mode: 'HTML'
	})
});

chatDetailed.action('back', ctx => {
	ctx.scene.state = {};
	deleteLastMessage(ctx);
	ctx.scene.enter(ALL_CHATS_SCENE);
});

chatDetailed.action('chat_library', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(CHAT_LIBRARY_SCENE, { chatId: ctx.scene.state.chatId });
});

chatDetailed.action('delete_chat', async (ctx) => {
	const chatId = ctx.scene.state.chatId;

	try {
		const chatToDelete = await Chat.findOne({ where: { id: chatId } });
		Chat.destroy({ where: { id: chatId } });

		const msg = await ctx.reply(`✅ Чат ${chatToDelete.name} был успешно удалён!`);
		setTimeout(() => {
			ctx.deleteMessage(msg.message_id);
		}, 3000);
	} catch (error) {
		console.error('Error while processing REMOVE_CHAT:', error);
		ctx.reply('❌ Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.');
	}
});

module.exports = { chatDetailed };