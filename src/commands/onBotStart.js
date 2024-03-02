const { User } = require('../database/models');

async function onBotStart(ctx) {
	const userId = ctx.from.id;
	const args = ctx.message.text.split(' ').slice(1);
	
	if (args.length) {
		if (args[0] === userId) {
			ctx.reply('Вы не можете сделать рефералом самого себя');
		} else {
			const referrer = await User.findByPk(args[0]);
			await referrer.update({ referrals: [...referrer.referrals, userId] });
			
			ctx.reply(`You were invited by <code>${args[0]}</code>`, {
				parse_mode: 'HTML'
			});
		}
	}

	try {
		const user = await User.findOne({ where: { id: userId } });
		if (!user) {
			await User.create({ id: userId, invitedBy: args[0] || null });
		}
	} catch (error) {
		console.error('Ошибка при поиске или создании пользователя:', error);
	}

	ctx.reply('Советую подписаться на канал, чтобы быть в курсе всех событий', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Подписаться на канал', url: 'https://t.me/aaaatestaaaa5' }],
				[{ text: 'Продолжить', callback_data: 'goMain' }]
			]
		}
	});
}

module.exports = { onBotStart };