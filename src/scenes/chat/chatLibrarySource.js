const { Scenes } = require('telegraf');
const { CHAT_LIBRARY_SOURCE_SCENE, CHAT_LIBRARY_SCENE } = require('../../constants/scenes');
const { Resource, Chat } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { processes } = require('../../utils/stream/processes');
const { startStream } = require('./helpers/startStream');
const { sourcesWithUrl } = require('./helpers/sourcesWithUrl');
const { checkForStatus } = require('../../middleware/checkForStatus');

const chatLibrarySource = new Scenes.BaseScene(CHAT_LIBRARY_SOURCE_SCENE);

chatLibrarySource.enter(async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;

	const source = await Resource.findByPk(sourceId);

	ctx.reply(`<b>Назва ресурсу: ${source.name}</b>\n<b>Посилання на ресурс: ${source.url}</b>`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🔥 Запустити трансляцію ресурсу', callback_data: 'stream_source' }],
				[{ text: '❌ Видалити ресурс з бібліотеки ефіру', callback_data: 'delete_source' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }],
			]
		},
		parse_mode: 'HTML'
	});
});

chatLibrarySource.action('stream_source', async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;
	const chatId = ctx.scene.state.chatId;
	
	const chat = await Chat.findByPk(chatId);

	// End stream if it's running
	const chatStreamKey = chat.streamKey;
	if (processes.getProcessById(chatStreamKey)) {
		processes.stopProcess(chatStreamKey);
	}

	// Start new stream with new source
	const chatSource = await Resource.findByPk(sourceId);
	const sourceToStream = await sourcesWithUrl([chatSource]);
	
	const isStreamStarted = await startStream(sourceToStream, chatStreamKey, ctx);
	if (isStreamStarted) {
		await Chat.update({ status: 'on' }, { where: { streamKey: chatStreamKey } });
		ctx.editMessageReplyMarkup({
			inline_keyboard: [
				[{ text: '❌ Видалити ресурс з бібліотеки ефіру', callback_data: 'delete_source' }],
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		});
	}
});

chatLibrarySource.action('delete_source', checkForStatus, async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;
	const chatId = ctx.scene.state.chatId;

	try {
		const sourceToDelete = await Resource.findByPk(sourceId);
		const chat = await Chat.findByPk(chatId);
	
		chat.removeResource(sourceToDelete);
		ctx.reply('✅ Ресурс було успішно видалено з бібліотеки ефіру');
	} catch (error) {
		console.log(error);
		ctx.reply('❌ Виникла помилка під час видалення ресурсу');
	}
});

chatLibrarySource.action('back', ctx => {
	const chatId = ctx.scene.state.chatId;
	deleteLastMessage(ctx);
	ctx.scene.enter(CHAT_LIBRARY_SCENE, { chatId });
});

module.exports = { chatLibrarySource };