const { Scenes } = require('telegraf');
const { ADMIN_TOPUP_USER_BALANCE_SCENE, ADMIN_MANAGE_USERS_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const topupBalance = new Scenes.BaseScene(ADMIN_TOPUP_USER_BALANCE_SCENE);

topupBalance.enter(ctx => {
	ctx.reply('Введіть ID користувача та суму поповнення (в доларах) через кому\nПриклад: <code>6132805840, 100</code>', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			],
		},
		parse_mode: 'HTML'
	});
});

topupBalance.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
});

topupBalance.on('message', async (ctx) => {
	const [userIdTopup, sum] = ctx.message.text.split(',');

	try {
		await User.increment('balance', { by: sum, where: { id: userIdTopup } });

		const msg = await ctx.reply(`Рахунок користувача ${userIdTopup} було успішно поповнено на ${sum.trim()} доларів!`);
		ctx.telegram.sendMessage(userIdTopup, `Ваш рахунок було поповнено на ${sum.trim()} доларів!`);
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply('Сталася помилка при поповненні!');
		console.log(error);
	} finally {
		ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
	}
});

module.exports = { topupBalance };