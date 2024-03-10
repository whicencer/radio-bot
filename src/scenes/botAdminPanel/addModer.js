const { Scenes } = require('telegraf');
const { ADMIN_PANEL_SCENE, ADD_MODER_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addModer = new Scenes.BaseScene(ADD_MODER_SCENE);

addModer.enter(ctx => {
	ctx.reply('Введіть ID користувача, якого хочете зробити модератором', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		}
	});
});

addModer.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_PANEL_SCENE);
});

addModer.on('message', async (ctx) => {
	const msgText = ctx.message.text;
	
	try {
		const userToFind = await User.findByPk(msgText);
		await userToFind.update({ role: 'moderator' });

		ctx.telegram.sendMessage(msgText, `Вам були надані права Модератора`);
		const msg = await ctx.reply('Користувач був успішно доданий до списку адміністраторів бота');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		ctx.scene.enter(ADMIN_PANEL_SCENE);
	} catch (error) {
		ctx.reply('Користувача з таким ID не знайдено в базі даних бота');
	}
});

module.exports = { addModer };