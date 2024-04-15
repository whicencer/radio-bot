const { ALL_CHATS_SCENE } = require('../../../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../../../constants/subscriptions');
const { User } = require('../../../database/models');
const { getLanguage } = require('../../../utils/getLanguage');

const maxChannelsByTariff = {
	['none']: 0,
	[BASIC.id]: BASIC.max_chats,
	[ADVANCED.id]: ADVANCED.max_chats,
	[PREMIUM.id]: PREMIUM.max_chats
};

const checkForChatLimit = async (ctx, next) => {
	const userId = ctx.from.id;
	
	try {
		const { tariff, chats } = await User.findByPk(userId, { include: 'chats' });
		const chatsLength = chats.length;
		const maxChannels = maxChannelsByTariff[tariff];

			const msgReply = `${getLanguage(ctx.session.lang, "Ваш текущий тариф")}: ${tariff}\nMax channels: ${maxChannels}\n
	<b>Advanced</b> - ${ADVANCED.max_chats} ${getLanguage(ctx.session.lang, "каналов")}
	<b>Premium</b> - ${PREMIUM.max_chats} ${getLanguage(ctx.session.lang, "каналов")}\n`;

		if (chatsLength >= maxChannels) {
			await ctx.reply(msgReply, {
				parse_mode: 'HTML'
			});
			ctx.scene.enter(ALL_CHATS_SCENE);
		} else {
			next();
		}
	} catch (error) {
		console.log("Произошла ошибка при проверке лимита: ", error);
	}
};

module.exports = { checkForChatLimit };