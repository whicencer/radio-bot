const { Scenes } = require('telegraf');
const { Chat } = require('../../database/models');
const { ALL_CHATS_SCENE, CHAT_DETAILED_SCENE, CHAT_LIBRARY_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { processes } = require('../../utils/stream/processes');
const { deleteChat } = require('./helpers/deleteChat');
const { sourcesWithUrl } = require('./helpers/sourcesWithUrl');
const { startStream } = require('./helpers/startStream');
const { createActionButton } = require('./helpers/createActionButton');
const { checkForSources } = require('./middleware/checkForSources');
const { checkForSub } = require('../../middleware/checkForSub');
const { checkForStatus } = require('../../middleware/checkForStatus');
const { checkForStatusStopped } = require('../../middleware/checkForStatusStopped');
const { getLanguage } = require('../../utils/getLanguage');

const chatDetailed = new Scenes.BaseScene(CHAT_DETAILED_SCENE);

chatDetailed.enter(async (ctx) => {
	const baseKeyboard = [
		[{ text: `🎥 ${getLanguage(ctx.session.lang, "Библиотека эфира")}`, callback_data: 'chat_library' }],
		[{ text: `❌ ${getLanguage(ctx.session.lang, "Удалить канал")}`, callback_data: 'delete_chat' }],
		[{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }]
	];

	const chatId = ctx.scene.state.chatId;
	
	try {
		const chat = await Chat.findOne({ where: {id: chatId}, include: 'resources' });
		ctx.scene.session.chat = chat;

		const msg = await ctx.reply('Loading...');

		ctx.scene.session.chatSources = await sourcesWithUrl(chat.resources);

		const currentSourceTitle = processes.getSourceTitle(chat.streamKey);
		const actionButton = createActionButton(chat.status);
		
		ctx.reply(`<b>${getLanguage(ctx.session.lang, "Канал:")} <code>${chat.name}</code></b>\n<b>${getLanguage(ctx.session.lang, "Ссылка на канал:")} ${chat.chatLink}</b>\n<b>${getLanguage(ctx.session.lang, "Сейчас играет:")}</b> ${currentSourceTitle}`, {
			reply_markup: {
				inline_keyboard: [
					[actionButton],
					...baseKeyboard
				]
			},
			parse_mode: 'HTML'
		});

		ctx.deleteMessage(msg.message_id);
	} catch (error) {
		console.log("Произошла ошибка при отображении канала: ", error);
	}
});

chatDetailed.action('stop_stream', checkForStatusStopped, async (ctx) => {
	const { streamKey } = ctx.scene.session.chat;
	const baseKeyboard = [
		[{ text: `🎥 ${getLanguage(ctx.session.lang, "Библиотека эфира")}`, callback_data: 'chat_library' }],
		[{ text: `❌ ${getLanguage(ctx.session.lang, "Удалить канал")}`, callback_data: 'delete_chat' }],
		[{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }]
	];
	
	try {
		processes.stopProcess(streamKey);
		const msg = await ctx.reply(getLanguage(ctx.session.lang, "Трансляция была остановлена!"));
		deleteMessageWithDelay(ctx, msg.message_id, 3000);

		ctx.editMessageReplyMarkup({
			inline_keyboard: [
				[{ text: `🔥 ${getLanguage(ctx.session.lang, "Запустить")}`, callback_data: 'start_stream' }],
				...baseKeyboard
			]
		});
	} catch (error) {
		ctx.reply('Error while stopping stream');
		console.log('Error on stream stop: ' + error);
	}
});

chatDetailed.action('start_stream', checkForStatus, checkForSources, checkForSub, async (ctx) => {
	const resources = ctx.scene.session.chatSources;
	const { streamKey } = ctx.scene.session.chat;
	const baseKeyboard = [
		[{ text: `🎥 ${getLanguage(ctx.session.lang, "Библиотека эфира")}`, callback_data: 'chat_library' }],
		[{ text: `❌ ${getLanguage(ctx.session.lang, "Удалить канал")}`, callback_data: 'delete_chat' }],
		[{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }]
	];

	try {
		const isStreamStarted = await startStream(resources, streamKey, ctx);
		if (isStreamStarted) {
			ctx.editMessageReplyMarkup({
				inline_keyboard: [
					[{ text: '🚫 Stop', callback_data: 'stop_stream' }],
					...baseKeyboard
				]
			});
		}
	} catch (error) {
		ctx.reply('Error while starting stream');
		console.log('Error on stream start: ' + error);
	}
});

chatDetailed.action('back', ctx => {
	ctx.scene.state = {};
	deleteLastMessage(ctx);
	ctx.scene.enter(ALL_CHATS_SCENE);
});

chatDetailed.action('chat_library', checkForSub, ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(CHAT_LIBRARY_SCENE, { chatId: ctx.scene.state.chatId });
});

chatDetailed.action('delete_chat', checkForStatus, checkForSub, async (ctx) => {
	const chatId = ctx.scene.state.chatId;

	try {
		deleteChat(chatId, ctx);
	} catch (error) {
		console.error('Error while processing REMOVE_CHAT:', error);
		ctx.reply('❌ Error while deleting chat. Please try again later.');
	}
});

module.exports = { chatDetailed };