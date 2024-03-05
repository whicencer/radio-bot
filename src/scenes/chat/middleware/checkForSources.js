const { Chat } = require('../../../database/models');

const checkForSources = async (ctx, next) => {
	const chatId = ctx.scene.state.chatId;
	const { resources } = await Chat.findByPk(chatId, {include: 'resources' });

	if (resources.length < 1) {
		ctx.reply('Вы не можете запустить трансляцию, для начала добавьте ресурс в библиотеку эфира!');
	} else {
		next();
	}
};

module.exports = { checkForSources };