const { ALL_CHATS_SCENE } = require('../../../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../../../constants/subscriptions');
const { User } = require('../../../database/models');

const maxChannelsByTariff = {
	['none']: 0,
	[BASIC.id]: BASIC.max_chats,
	[ADVANCED.id]: ADVANCED.max_chats,
	[PREMIUM.id]: PREMIUM.max_chats
};

const checkForChatLimit = async (ctx, next) => {
	const userId = ctx.from.id;
	
	const { tariff, chats } = await User.findByPk(userId, { include: 'chats' });
	const chatsLength = chats.length;
	const maxChannels = maxChannelsByTariff[tariff];

  const msgReply = `Ваш поточний тариф: ${tariff}\nВи можете створити ${maxChannels} каналів\n
<b>Advanced</b> - ${ADVANCED.max_chats} каналів
<b>Premium</b> - ${PREMIUM.max_chats} каналів\n`;

	if (chatsLength >= maxChannels) {
		await ctx.reply(msgReply, {
			parse_mode: 'HTML'
		});
		ctx.scene.enter(ALL_CHATS_SCENE);
	} else {
		next();
	}
};

module.exports = { checkForChatLimit };