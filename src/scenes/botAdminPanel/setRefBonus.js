const { Scenes } = require('telegraf');
const { ADMIN_SET_REF_BONUS_SCENE, ADMIN_MANAGE_USERS_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');

const setRefBonus = new Scenes.BaseScene(ADMIN_SET_REF_BONUS_SCENE);

setRefBonus.enter(ctx => {
	ctx.scene.session.stage = 1;
	ctx.reply('Введіть ID користувача якому хочете налаштувати реферальний бонус', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
			]
		}
	});
});

setRefBonus.on('message', async (ctx) => {
	if (ctx.scene.session.stage === 1) {
		const userId = ctx.message.text;
		
		try {
			const user = await User.findByPk(userId);
			if (!user) throw new Error('User not found');

			ctx.scene.session.stage = 2;
			ctx.scene.session.user = user;

			ctx.reply('Введіть процент, який користувач отримає за поповнення реферала (ціле число)', {
				reply_markup: {
					inline_keyboard: [
						[{ text: '🚫 Скасувати', callback_data: 'cancel' }]
					]
				}
			});
		} catch (error) {
			ctx.reply('Користувача з таким ID не було знайдено в базі даних бота.');
		}
	} else if (ctx.scene.session.stage === 2) {
		const percent = ctx.message.text;
		const user = ctx.scene.session.user;
		if (percent%1 !== 0) {
			ctx.reply('Це повинно бути ціле число!');
		} else {
			await user.update({ refPercent: percent });
			ctx.reply(`Реферальний бонус було успішно налаштовано! Тепер користувач з ID ${user.id} отримає ${percent}% з кожного поповнення реферала.`);
			ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
		}
	}
});

setRefBonus.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
});

module.exports = { setRefBonus };