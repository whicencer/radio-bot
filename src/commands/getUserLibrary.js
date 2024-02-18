const { User: UserModel } = require('../database/models');

async function getUserLibrary(bot, msg) {
	const chatId = msg.chat.id;
	const userId = msg.from.id;
	const user = await UserModel.findOne({ where: {id: userId}, include: 'resources' });
	const resourcesBtns = user.resources.map(resource => ([{ text: `🎧 ${resource.name}`, callback_data: resource.url }]));

	bot.sendMessage(chatId, '📀 Ваша библиотека', {
		reply_markup: {
			inline_keyboard: [
				...resourcesBtns,
				[{ text: '➕ Добавить ресурс', callback_data: 'add_resource' }]
			]
		}
	});
}

module.exports = { getUserLibrary };