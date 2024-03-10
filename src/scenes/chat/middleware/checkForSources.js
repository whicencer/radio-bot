const { Chat } = require('../../../database/models');

const checkForSources = async (ctx, next) => {
	const chatId = ctx.scene.state.chatId;
	const { resources } = await Chat.findByPk(chatId, {include: 'resources' });

	if (resources.length < 1) {
		ctx.reply('Ви не можете запустити трансляцію, для початку додайте ресурс в бібліотеку ефіру!');
	} else {
		next();
	}
};

module.exports = { checkForSources };