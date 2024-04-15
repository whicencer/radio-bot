const { Scenes } = require('telegraf');
const { ADD_YOUTUBE_SCENE, ADD_LIBRARY_SOURCE_SCENE, LIBRARY_SCENE, ADD_SOURCE_TO_CHAT_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { youtubeUrlValidate } = require('../../utils/validators/youtubeUrlValidate');
const { Resource } = require('../../database/models');
const { getSourceTitle } = require('../../utils/youtube');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { getLanguage } = require('../../utils/getLanguage');

const addYoutube = new Scenes.BaseScene(ADD_YOUTUBE_SCENE);

addYoutube.enter(ctx => {
	const msg = `${getLanguage(ctx.session.lang, "Пришлите ссылку на YouTube видео или трансляцию (в точно таком же формате, как указано в примере)")}\n
	${getLanguage(ctx.session.lang, "Пример")}: https://www.youtube.com/watch?v=dQw4w9WgXcQ
	Mobile: https://youtu.be/dQw4w9WgXcQ
	Livestream: https://youtube.com/live/jfKfPfyJRdk`;
	
	ctx.reply(msg, {
		link_preview_options: {
			is_disabled: true
		},
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Cancel', callback_data: 'cancel' }]
			]
		}
	});
});

addYoutube.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_LIBRARY_SOURCE_SCENE);
});

addYoutube.on('message', async (ctx) => {
	const url = ctx.message.text;
	const userId = ctx.from.id;

	if (!youtubeUrlValidate(url)) {
		ctx.reply(getLanguage(ctx.session.lang, "Неверный формат ссылки"));
	} else {
		try {
			const sourceTitle = await getSourceTitle(url);
			const createdSource = await Resource.create({ userId, name: sourceTitle, url });
	
			const msg = await ctx.reply('✅ Success!');

			ctx.scene.enter(ADD_SOURCE_TO_CHAT_SCENE, { createdSource });
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (err) {
			ctx.reply('❌ Error while adding source. Please try again later.');
			ctx.scene.enter(LIBRARY_SCENE);
		}
	}
});

module.exports = { addYoutube };