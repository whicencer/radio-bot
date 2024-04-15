const { Scenes } = require('telegraf');
const { CHAT_LIBRARY_SOURCE_SCENE, CHAT_LIBRARY_SCENE } = require('../../constants/scenes');
const { Resource, Chat } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { processes } = require('../../utils/stream/processes');
const { startStream } = require('./helpers/startStream');
const { sourcesWithUrl } = require('./helpers/sourcesWithUrl');
const { checkForStatus } = require('../../middleware/checkForStatus');
const { getLanguage } = require('../../utils/getLanguage');

const chatLibrarySource = new Scenes.BaseScene(CHAT_LIBRARY_SOURCE_SCENE);

chatLibrarySource.enter(async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;

	const source = await Resource.findByPk(sourceId);

	ctx.reply(`<b>${getLanguage(ctx.session.lang, "Название ресурса")}: ${source.name}</b>\n<b>${getLanguage(ctx.session.lang, "Ссылка на ресурс")}: ${source.url}</b>`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: `🔥 ${getLanguage(ctx.session.lang, "Запустить трансляцию ресурса")}`, callback_data: 'stream_source' }],
				[{ text: `❌ ${getLanguage(ctx.session.lang, "Удалить ресурс из библиотеки эфира")}`, callback_data: 'delete_source' }],
				[{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }],
			]
		},
		parse_mode: 'HTML'
	});
});

chatLibrarySource.action('stream_source', checkForStatus, async (ctx) => {
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
		await ctx.editMessageReplyMarkup({
      inline_keyboard: [
        [{ text: `❌ ${getLanguage(ctx.session.lang, "Удалить ресурс из библиотеки эфира")}`, callback_data: 'delete_source' }],
        [{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }]
      ]
    });
		return;
	}
});

chatLibrarySource.action('delete_source', checkForStatus, async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;
	const chatId = ctx.scene.state.chatId;

	try {
		const sourceToDelete = await Resource.findByPk(sourceId);
		const chat = await Chat.findByPk(chatId);
	
		chat.removeResource(sourceToDelete);
		ctx.reply('✅ Success!');
	} catch (error) {
		console.log(error);
		ctx.reply('❌ Error while deleting source. Please try again later.');
	}
});

chatLibrarySource.action('back', ctx => {
	const chatId = ctx.scene.state.chatId;
	deleteLastMessage(ctx);
	ctx.scene.enter(CHAT_LIBRARY_SCENE, { chatId });
});

module.exports = { chatLibrarySource };