const { Scenes } = require('telegraf');
const { ADMIN_PANEL_SCENE, ADD_MODER_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const addModer = new Scenes.BaseScene(ADD_MODER_SCENE);

addModer.enter(ctx => {
	ctx.reply('Введите ID пользователя, которого хотите сделать модератором', {
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

		ctx.telegram.sendMessage(msgText, `Вам были выданы права Модератора`);
		const msg = await ctx.reply('Пользователь был успешно добавлен в список администраторов бота');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		ctx.scene.enter(ADMIN_PANEL_SCENE);
	} catch (error) {
		ctx.reply('Пользователь с таким ID не найден в базе данных бота');
	}
});

module.exports = { addModer };