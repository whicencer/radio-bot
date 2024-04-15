const { Scenes } = require('telegraf');
const { LIBRARY_SOURCE_SCENE, LIBRARY_SCENE } = require('../../constants/scenes');
const { Resource } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { checkForStatus } = require('../../middleware/checkForStatus');
const { getLanguage } = require('../../utils/getLanguage');

const librarySource = new Scenes.BaseScene(LIBRARY_SOURCE_SCENE);

librarySource.enter(async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;

	try {
		const source = await Resource.findOne({ where: { id: sourceId } });
		ctx.scene.state.chatId = source.chatId;
		
		ctx.reply(`${getLanguage(ctx.session.lang, "Источник")}: ${source.url}`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: `❌ ${getLanguage(ctx.session.lang, "Удалить ресурс")}`, callback_data: 'delete_source' }],
					[{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }]
				]
			}
		});
	} catch (error) {
		console.error('Error while getting source:', error);
		ctx.reply('❌ Error while getting source. Please try again later.');
	}
});

librarySource.action('delete_source', checkForStatus, async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;

	try {
		await Resource.destroy({
			where: { id: sourceId }
		});

		const msg = await ctx.reply('✅ Success!');
		
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply('❌ Error while removing source. Please try again later.');
	} finally {
		deleteLastMessage(ctx);
		ctx.scene.enter(LIBRARY_SCENE);
	}
});

librarySource.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(LIBRARY_SCENE);
});

module.exports = { librarySource };