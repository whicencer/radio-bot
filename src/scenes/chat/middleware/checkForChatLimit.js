const { ALL_CHATS_SCENE } = require('../../../constants/scenes');
const { BASIC, ADVANCED, PREMIUM } = require('../../../constants/subscriptions');
const { User } = require('../../../database/models');
const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');

const maxChannelsByTariff = {
	[BASIC.id]: BASIC.max_chats,
	[ADVANCED.id]: ADVANCED.max_chats,
	[PREMIUM.id]: PREMIUM.max_chats
};

const checkForChatLimit = async (ctx, next) => {
	const userId = ctx.from.id;
	
	const { tariff, chats } = await User.findByPk(userId, { include: 'chats' });
	const chatsLength = chats.length;
	const maxChannels = maxChannelsByTariff[tariff];

	if (chatsLength === maxChannels) {
		const msg = await ctx.reply(`😔 Лимит добавления чатов исчерпан! (макс. ${maxChannels})`);
		ctx.scene.enter(ALL_CHATS_SCENE);

		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} else {
		next();
	}
};

module.exports = { checkForChatLimit };