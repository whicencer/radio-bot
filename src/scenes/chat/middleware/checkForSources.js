const { Chat } = require('../../../database/models');
const { getLanguage } = require('../../../utils/getLanguage');

const checkForSources = async (ctx, next) => {
	const chatId = ctx.scene.state.chatId;
	try {
		const { resources } = await Chat.findByPk(chatId, {include: 'resources' });

		if (resources.length < 1) {
			ctx.reply(getLanguage(ctx.session.lang, "Вы не можете запустить трансляцию, для начала добавьте ресурс в библиотеку эфира!"));
		} else {
			next();
		}
	} catch (error) {
		console.log("Произошла ошибка при проверке ресурсов: ", error);
	}
};

module.exports = { checkForSources };