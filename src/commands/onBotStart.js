const { User: UserModel } = require('../database/models');

async function onBotStart(bot, msg) {
	const chatId = msg.chat.id;
	const firstName = msg.from.first_name;
	const userId = msg.from.id;
	const message = `Приветствую тебя, ${firstName}`;

	try {
		const user = await UserModel.findOne({ where: { id: userId } });
		if (!user) {
			await UserModel.create({ id: userId });
		}
	} catch (error) {
		console.error('Ошибка при поиске или создании пользователя:', error);
	}		

	await bot.sendMessage(chatId, message, {
		reply_markup: {
			keyboard: [
				[{ text: '👤 Профиль' }],
				[{ text: '📀 Библиотека' }],
				[{ text: '💬 Чаты' }],
			]
		}
	});
}

module.exports = { onBotStart };