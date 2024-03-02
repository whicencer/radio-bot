const { BASIC, ADVANCED, PREMIUM } = require('../constants/subscriptions');
const { User } = require('../database/models');

const maxChannelsByTariff = {
	[BASIC.id]: BASIC.max_chats,
	[ADVANCED.id]: ADVANCED.max_chats,
	[PREMIUM.id]: PREMIUM.max_chats
};

const createChatMiddleware = async (userId) => {
	const { tariff, chats } = await User.findByPk(userId, { include: 'chats' });
	const chatsLength = chats.length;
	const maxChannels = maxChannelsByTariff[tariff];

	if (chatsLength === maxChannels) {
		throw new Error(`😔 Лимит добавления чатов исчерпан! (макс. ${maxChannels})`);
	}

	return true;
};

module.exports = { createChatMiddleware };