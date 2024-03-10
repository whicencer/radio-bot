const { Scenes } = require('telegraf');
const { ADD_YOUTUBE_SCENE, ADD_SOURCE_SCENE, LIBRARY_SCENE, ADD_SOURCE_TO_CHAT_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { youtubeUrlValidate } = require('../../utils/validators/youtubeUrlValidate');
const { Resource } = require('../../database/models');
const { getSourceTitle } = require('../../utils/youtube');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addYoutube = new Scenes.BaseScene(ADD_YOUTUBE_SCENE);
const msg = `Надішліть посилання на відео або трансляцію на YouTube (У точно такому ж форматі, як вказано в прикладі)\n
Приклад: https://www.youtube.com/watch?v=dQw4w9WgXcQ
З телефону: https://youtu.be/dQw4w9WgXcQ
Пряма трансляція: https://youtube.com/live/jfKfPfyJRdk`;

addYoutube.enter(ctx => {
	ctx.reply(msg, {
		link_preview_options: {
			is_disabled: true
		},
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
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
		ctx.reply('Невірний формат посилання');
	} else {
		try {
			const sourceTitle = await getSourceTitle(url);
			const createdSource = await Resource.create({ userId, name: sourceTitle, url });
	
			const msg = await ctx.reply('✅ Ресурс був успішно доданий!');

			ctx.scene.enter(ADD_SOURCE_TO_CHAT_SCENE, { createdSource });
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (err) {
			ctx.reply('❌ Сталася помилка при додаванні ресурсу: Можливо ви ввели посилання не вірно');
			ctx.scene.enter(LIBRARY_SCENE);
		}
	}
});

module.exports = { addYoutube };