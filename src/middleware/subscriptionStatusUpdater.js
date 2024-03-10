// Мидлварина которая будет проверять подписку пользователя на истечение срока и обновлять его данные в БД
// И уведомлять его об этом

const { NONE } = require('../constants/subscriptions');
const { User, Chat } = require('../database/models');
const { processes } = require('../utils/stream/processes');

const subscriptionStatusUpdater = async (ctx, next) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);
	const userChats = await Chat.findAll({ where: { userId } });

	if (user && user.subExpiresAt !== null && new Date() >= user.subExpiresAt) {
		// Останавливаем все трансляции
		userChats.forEach(chat => {
			const chatStreamKey = chat.streamKey;
			processes.stopProcess(chatStreamKey);
		});
		
		// Уведомляем о том что подписка истекла и меняем в БД tariff=none
		user.update({ tariff: NONE, subExpiresAt: null });
		ctx.reply('Ваша підписка закінчилася!');
	}

	next();
};

module.exports = { subscriptionStatusUpdater };