const { Scenes } = require('telegraf');
const { ADD_ADMIN_SCENE, ADMIN_PANEL_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addAdmin = new Scenes.BaseScene(ADD_ADMIN_SCENE);

addAdmin.enter(ctx => {
	ctx.reply('Введіть ID користувача, якого хочете зробити адміністратором', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		}
	});
});

addAdmin.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_PANEL_SCENE);
});

addAdmin.on('message', async (ctx) => {
	const msgText = ctx.message.text;
	
	try {
		const userToFind = await User.findByPk(msgText);
		await userToFind.update({ role: 'admin' });

		ctx.telegram.sendMessage(msgText, `Вам були надані права Адміністратора`);
		const msg = await ctx.reply('Користувач був успішно доданий до списку адміністраторів бота');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		ctx.scene.enter(ADMIN_PANEL_SCENE);
	} catch (error) {
		ctx.reply('Користувача з таким ID не знайдено в базі даних бота');
	}
});

module.exports = { addAdmin };