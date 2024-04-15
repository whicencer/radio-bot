const { Scenes } = require('telegraf');
const { ADD_LIBRARY_SOURCE_SCENE, LIBRARY_SCENE, ADD_SOURCE_TO_CHAT_SCENE, ADD_TWITCH_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { twitchUrlValidate } = require('../../utils/validators/twitchUrlValidate');
const { Resource } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { getLanguage } = require('../../utils/getLanguage');

const addTwitch = new Scenes.BaseScene(ADD_TWITCH_SCENE);

addTwitch.enter(ctx => {
	const msg = getLanguage(ctx.session.lang, "Отправьте ссылку на стрим Twitch (В точно таком же формате, как указано в примере)\nПример: https://www.twitch.tv/twitch");
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

addTwitch.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_LIBRARY_SOURCE_SCENE);
});

addTwitch.on('message', async (ctx) => {
	const url = ctx.message.text;
	const userId = ctx.from.id;
	const streamerName = url.replace('https://www.twitch.tv/', '');

	if (!twitchUrlValidate(url)) {
		ctx.reply(getLanguage(ctx.session.lang, "Неверный формат ссылки"));
	} else {
		try {
			const createdSource = await Resource.create({ userId, name: `${streamerName} (Twitch)`, url });
	
			const msg = await ctx.reply('✅ Success!');

			ctx.scene.enter(ADD_SOURCE_TO_CHAT_SCENE, { createdSource });
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (err) {
			ctx.reply('❌ Error while adding source. Please try again later.');
			ctx.scene.enter(LIBRARY_SCENE);
		}
	}
});

module.exports = { addTwitch };