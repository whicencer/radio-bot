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
const { debounce } = require('../../utils/debounce');
const { checkForSources } = require('./middleware/checkForSources');
const { checkForSub } = require('../../middleware/checkForSub');
const { checkForStatus } = require('../../middleware/checkForStatus');

const chatDetailed = new Scenes.BaseScene(CHAT_DETAILED_SCENE);

chatDetailed.enter(async (ctx) => {
	const chatId = ctx.scene.state.chatId;
	const chat = await Chat.findOne({ where: {id: chatId}, include: 'resources' });
	ctx.scene.session.chat = chat;

	const msg = await ctx.reply('Загрузка...');

	const sourcesWithVideoUrl = await sourcesWithUrl(chat.resources);
	ctx.scene.session.chatSources = sourcesWithVideoUrl;

	const currentSourceTitle = processes.getSourceTitle(chat.streamKey);
	const actionButton = createActionButton(chat.status);
	
	ctx.reply(`<b>Чат: <code>${chat.name}</code></b>\n<b>Ссылка на чат: ${chat.chatLink}</b>\n<b>Сейчас играет</b>: ${currentSourceTitle}`, {
		reply_markup: {
			inline_keyboard: [
				[actionButton],
				[{ text: '🎥 Библиотека эфира', callback_data: 'chat_library' }],
				[{ text: '❌ Удалить чат', callback_data: 'delete_chat' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		},
		parse_mode: 'HTML'
	});

	ctx.deleteMessage(msg.message_id);
});

chatDetailed.action('stop_stream', debounce(async (ctx) => {
	const { streamKey } = ctx.scene.session.chat;
	
	try {
		processes.stopProcess(streamKey);
		const msg = await ctx.reply('Трансляция была остановлена!');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);

		ctx.editMessageReplyMarkup({
			inline_keyboard: [
				[{ text: '🔥 Запустить', callback_data: 'start_stream' }],
				[{ text: '🎥 Библиотека эфира', callback_data: 'chat_library' }],
				[{ text: '❌ Удалить чат', callback_data: 'delete_chat' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		});
	} catch (error) {
		ctx.reply('Ошибка при остановке трансляции');
		console.log('Error on stream stop: ' + error);
	}
}, 1000));

chatDetailed.action('start_stream', checkForStatus, checkForSources, checkForSub, debounce(async (ctx) => {
	const resources = ctx.scene.session.chatSources;
	const { streamKey } = ctx.scene.session.chat;

	try {
		startStream(resources, streamKey, ctx);
		ctx.editMessageReplyMarkup({
			inline_keyboard: [
				[{ text: '🚫 Остановить', callback_data: 'stop_stream' }],
				[{ text: '🎥 Библиотека эфира', callback_data: 'chat_library' }],
				[{ text: '❌ Удалить чат', callback_data: 'delete_chat' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		});
	} catch (error) {
		ctx.reply('Ошибка при запуске трансляции');
		console.log('Error on stream start: ' + error);
	}
}, 1000));

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
		ctx.reply('❌ Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.');
	}
});

module.exports = { chatDetailed };