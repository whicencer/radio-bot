const { Scenes } = require('telegraf');
const { ADD_SOURCE_SCENE, LIBRARY_SCENE, ADD_SOURCE_TO_CHAT_SCENE, ADD_TWITCH_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { twitchUrlValidate } = require('../../utils/validators/twitchUrlValidate');
const { Resource } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addTwitch = new Scenes.BaseScene(ADD_TWITCH_SCENE);
const msg = `Отправьте ссылку на стрим Twitch (В точно таком же формате как указано в примере)\n
Пример: https://www.twitch.tv/jesusavgn`;

addTwitch.enter(ctx => {
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

addTwitch.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_SOURCE_SCENE);
});

addTwitch.on('message', async (ctx) => {
	const url = ctx.message.text;
	const userId = ctx.from.id;
	const streamerName = url.replace('https://www.twitch.tv/', '');

	if (!twitchUrlValidate(url)) {
		ctx.reply('Неверный формат ссылки');
	} else {
		try {
			const createdSource = await Resource.create({ userId, name: `${streamerName} (Twitch)`, url });
	
			const msg = await ctx.reply('✅ Ресурс был успешно добавлен!');

			ctx.scene.enter(ADD_SOURCE_TO_CHAT_SCENE, { createdSource });
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (err) {
			ctx.reply('❌ Произошла ошибка при добавлении ресурса: Возможно вы ввели ссылку не верно');
			ctx.scene.enter(LIBRARY_SCENE);
		}
	}
});

module.exports = { addTwitch };