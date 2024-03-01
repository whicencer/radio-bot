const { Scenes } = require('telegraf');
const { ADD_YOUTUBE_SCENE, ADD_SOURCE_SCENE, LIBRARY_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { youtubeUrlValidate } = require('../../utils/validators/youtubeUrlValidate');
const { Resource } = require('../../database/models');
const { getSourceTitle } = require('../../utils/youtube');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addYoutube = new Scenes.BaseScene(ADD_YOUTUBE_SCENE);
const msg = `Отправьте ссылку на видео на YouTube\n
Пример: https://www.youtube.com/watch?v=dQw4w9WgXcQ`;

addYoutube.enter(ctx => {
	ctx.reply(msg, {
		link_preview_options: {
			is_disabled: true
		},
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Отменить', callback_data: 'cancel' }]
			]
		}
	});
});

addYoutube.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_SOURCE_SCENE);
});

addYoutube.on('message', async (ctx) => {
	const url = ctx.message.text;
	const userId = ctx.from.id;

	if (!youtubeUrlValidate(url)) {
		ctx.reply('Неверный формат ссылки');
	} else {
		try {
			const sourceTitle = await getSourceTitle(url);
			await Resource.create({ userId, name: sourceTitle, url });
	
			const msg = await ctx.reply('✅ Ресурс был успешно добавлен!');

			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (err) {
			ctx.reply('❌ Произошла ошибка при добавлении ресурса: Возможно вы ввели ссылку не верно');
		} finally {
			ctx.scene.enter(LIBRARY_SCENE);
		}
	}
});

module.exports = { addYoutube };