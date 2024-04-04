const { Chat } = require('../../../database/models');

const checkForSources = async (ctx, next) => {
	const chatId = ctx.scene.state.chatId;
	try {
		const { resources } = await Chat.findByPk(chatId, {include: 'resources' });

		if (resources.length < 1) {
			ctx.reply('Ви не можете запустити трансляцію, для початку додайте ресурс в бібліотеку ефіру!');
		} else {
			next();
		}
	} catch (error) {
		console.log("Произошла ошибка при проверке ресурсов: ", error);
	}
};

module.exports = { checkForSources };