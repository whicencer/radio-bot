// Мидлварина которая будет проверять подписку пользователя на истечение срока и обновлять его данные в БД
// И уведомлять его об этом

const { NONE } = require('../constants/subscriptions');
const { User, Chat } = require('../database/models');
const { processes } = require('../utils/stream/processes');
const { getLanguage } = require('../utils/getLanguage');

const subscriptionStatusUpdater = async (ctx, next) => {
	const userId = ctx.from.id;
	
	try {
		const user = await User.findByPk(userId);
		const userChats = await Chat.findAll({ where: { userId } });

		if (user && user.subExpiresAt !== null && new Date() >= user.subExpiresAt) {
			// Останавливаем все трансляции
			userChats.forEach(chat => {
				const chatStreamKey = chat.streamKey;
				if (processes.getProcessById(chatStreamKey)) {
					processes.stopProcess(chatStreamKey);
				}
			});
			
			// Уведомляем о том что подписка истекла и меняем в БД tariff=none
			user.update({ tariff: NONE, subExpiresAt: null });
			ctx.reply(getLanguage(ctx.session.lang, "Ваша подписка истекла!"));
		}

		next();
	} catch (error) {
		console.log("Произошла ошибка при проверке подписки: ", error);
	}
};

module.exports = { subscriptionStatusUpdater };