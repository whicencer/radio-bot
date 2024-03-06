const { Scenes } = require('telegraf');
const { ADD_RADIO_SCENE, ADD_SOURCE_SCENE, LIBRARY_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { generateInlineKeyboard } = require('../../utils/generateInlineKeyboard');
const { radios } = require('../../constants/radios');
const { Resource } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addRadio = new Scenes.BaseScene(ADD_RADIO_SCENE);

addRadio.enter(ctx => {
	ctx.reply('Выберите радио которое хотите добавить:', {
		reply_markup: {
			inline_keyboard: [
				...generateInlineKeyboard(radios, 2, 'add'),
				[{ text: '🚫 Отменить', callback_data: 'cancel' }]
			]
		}
	});
});

addRadio.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_SOURCE_SCENE);
});

addRadio.on('callback_query', async (ctx) => {
	const callbackData = ctx.callbackQuery.data;
	const userId = ctx.from.id;

	if (callbackData.startsWith('add')) {
		const [radioName, radioUrl] = callbackData.replace('add', '').split('_pz_');
		
		try {
			Resource.create({ userId, name: radioName, url: `https://${radioUrl}` });

			const msg = await ctx.reply('✅ Радио было успешно добавлено!');

			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			console.log(error);
			ctx.reply('❌ Произошла ошибка при добавлении радио');
		} finally {
			deleteLastMessage(ctx);
			ctx.scene.enter(LIBRARY_SCENE);
		}
	}
});

module.exports = { addRadio };