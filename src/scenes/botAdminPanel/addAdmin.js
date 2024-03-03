const { Scenes } = require('telegraf');
const { ADD_ADMIN_SCENE, ADMIN_PANEL_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addAdmin = new Scenes.BaseScene(ADD_ADMIN_SCENE);

addAdmin.enter(ctx => {
	ctx.reply('Введите ID пользователя, которого хотите сделать администратором', {
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

		const msg = await ctx.reply('Пользователь был успешно добавлен в список администраторов бота');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		ctx.scene.enter(ADMIN_PANEL_SCENE);
	} catch (error) {
		ctx.reply('Пользователь с таким ID не найден в базе данных бота');
	}
});

module.exports = { addAdmin };