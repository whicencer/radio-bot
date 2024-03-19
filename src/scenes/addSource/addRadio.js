const { Scenes } = require('telegraf');
const { ADD_RADIO_SCENE, ADD_LIBRARY_SOURCE_SCENE, LIBRARY_SCENE, ADD_SOURCE_TO_CHAT_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { generateInlineKeyboard } = require('../../utils/generateInlineKeyboard');
const { radios } = require('../../constants/radios');
const { Resource } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addRadio = new Scenes.BaseScene(ADD_RADIO_SCENE);
const divider = '_pz_';

addRadio.enter(ctx => {
	ctx.reply('Виберіть радіо, яке хочете додати:', {
		reply_markup: {
			inline_keyboard: [
				...generateInlineKeyboard(radios, 2, 'add', divider),
				[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
			]
		}
	});
});

addRadio.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_LIBRARY_SOURCE_SCENE);
});

addRadio.on('callback_query', async (ctx) => {
	const callbackData = ctx.callbackQuery.data;
	const userId = ctx.from.id;

	if (callbackData.startsWith('add')) {
		const [radioName, radioUrl] = callbackData.replace('add', '').split(divider);
		
		try {
			const createdSource = await Resource.create({ userId, name: radioName, url: `https://${radioUrl}` });

			const msg = await ctx.reply('✅ Радіо було успішно додано!');

			ctx.scene.enter(ADD_SOURCE_TO_CHAT_SCENE, { createdSource });
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			console.log(error);
			ctx.reply('❌ Сталася помилка при додаванні радіо');
			ctx.scene.enter(LIBRARY_SCENE);
		} finally {
			deleteLastMessage(ctx);
		}
	}
});

module.exports = { addRadio };