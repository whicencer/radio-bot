const { User } = require('../database/models');

async function onBotStart(ctx) {
	const userId = ctx.message.from.id;
	
	try {
		const user = await User.findOne({ where: { id: userId } });
		if (!user) {
			await User.create({ id: userId });
		}
	} catch (error) {
		console.error('Ошибка при поиске или создании пользователя:', error);
	}

	ctx.reply('Советую подписаться на канал, дабы быть в курсе событий по боту', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Да братан, с кайфом', url: 'https://t.me/aaaatestaaaa5' }],
				[{ text: 'Продолжить', callback_data: 'goMain' }]
			]
		}
	});
}

module.exports = { onBotStart };