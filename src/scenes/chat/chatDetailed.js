const { Scenes } = require('telegraf');
const { Chat } = require('../../database/models');
const { ALL_CHATS_SCENE, CHAT_DETAILED_SCENE, CHAT_LIBRARY_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { getSourceUrl } = require('../../utils/youtube');
const { startStreaming } = require('../../utils/stream/startStreaming');
const { processes } = require('../../utils/stream/processes');

const chatDetailed = new Scenes.BaseScene(CHAT_DETAILED_SCENE);

chatDetailed.enter(async (ctx) => {
	const chatId = ctx.scene.state.chatId;
	const chat = await Chat.findOne({ where: {id: chatId}, include: 'resources' });
	ctx.scene.session.chat = chat;

	const msg = await ctx.reply('Загрузка...');

	const sourcesWithVideoUrl = [];
	for (const source of chat.resources) {
		const dataValues = source.dataValues;
		const videoSourceUrl = await getSourceUrl(dataValues.url);
		sourcesWithVideoUrl.push({ ...dataValues, url: videoSourceUrl });
	}
	ctx.scene.session.chatSources = sourcesWithVideoUrl;

	const currentSourceTitle = processes.getSourceTitle(chat.streamKey);

	const actionButton = chat.status === 'off'
		? [{ text: '🔥 Запустить', callback_data: 'start_stream' }]
		: [{ text: '🚫 Остановить', callback_data: 'stop_stream' }];
	
	ctx.reply(`<b>Чат: <code>${chat.name}</code></b>\n<b>Ссылка на чат: ${chat.chatLink}</b>\n<b>Сейчас играет</b>: ${currentSourceTitle}`, {
		reply_markup: {
			inline_keyboard: [
				actionButton,
				[{ text: '🎥 Библиотека эфира', callback_data: `chat_library` }],
				[{ text: '❌ Удалить чат', callback_data: 'delete_chat' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		},
		parse_mode: 'HTML'
	});

	ctx.deleteMessage(msg.message_id);
});

chatDetailed.action('stop_stream', async (ctx) => {
	const { name, streamKey } = ctx.scene.session.chat;
	
	try {
		processes.stopProcess(streamKey);
		const msg = await ctx.reply(`Трансляция в канале ${name} была остановлена!`);
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply('Ошибка при остановке трансляции');
		console.log('Error on stream stop: ' + error);
	}
});

chatDetailed.action('start_stream', async (ctx) => {
	const resources = ctx.scene.session.chatSources;
	const { name, streamKey } = ctx.scene.session.chat;

	try {
		startStreaming(resources, streamKey);
		const msg = await ctx.reply(`Трансляция в канале ${name} была запущена!`);
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply('Ошибка при запуске трансляции');
		console.log('Error on stream start: ' + error);
	}
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
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		console.error('Error while processing REMOVE_CHAT:', error);
		ctx.reply('❌ Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.');
	}
});

module.exports = { chatDetailed };