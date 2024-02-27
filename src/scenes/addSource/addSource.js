const { Scenes } = require('telegraf');
const { ADD_SOURCE_SCENE, LIBRARY_SCENE, ADD_YOUTUBE_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');

const addSource = new Scenes.BaseScene(ADD_SOURCE_SCENE);

addSource.enter(ctx => {
	ctx.reply('Выберите источник добавления ресурса', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🎦🎶 Youtube', callback_data: 'add_youtube' }],
				[{ text: '🎶 Radio', callback_data: 'add_radio' }],
				[{ text: '🚫 Отменить', callback_data: 'cancel' }]
			]
		}
	});
});

addSource.action('add_youtube', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_YOUTUBE_SCENE);
});

addSource.action('add_radio', ctx => {
	console.log('add radio');
});

addSource.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(LIBRARY_SCENE);
});

module.exports = { addSource };