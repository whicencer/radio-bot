const { Scenes } = require('telegraf');
const { LIBRARY_SOURCE_SCENE, LIBRARY_SCENE } = require('../../constants/scenes');
const { Resource } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');

const librarySource = new Scenes.BaseScene(LIBRARY_SOURCE_SCENE);

librarySource.enter(async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;

	try {
		const source = await Resource.findOne({ where: { id: sourceId } });
		
		ctx.reply(`Источник: ${source.url}`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: '❌ Удалить ресурс', callback_data: 'delete_source' }],
					[{ text: '⬅️ Назад', callback_data: 'back' }]
				]
			}
		});
	} catch (error) {
		console.error('Error while processing REMOVE_CHAT:', error);
		ctx.reply('❌ Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.');
	}
});

librarySource.action('delete_source', async (ctx) => {
	const sourceId = ctx.scene.state.sourceId;

	try {
		await Resource.destroy({
			where: { id: sourceId }
		});

		const msg = await ctx.reply('✅ Ресурс был успешно удалён!');
		
		setTimeout(() => {
			ctx.deleteMessage(msg.message_id);
		}, 3000);
	} catch (error) {
		ctx.reply('❌ Возникла ошибка при удалении ресурса');
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