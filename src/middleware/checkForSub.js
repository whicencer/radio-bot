// Мидлварина которая будет проверять пользователя на наличие подписки
// И защищать ресурс от не подписанных

const { SUBSCRIPTION_SCENE } = require('../constants/scenes');
const { NONE } = require('../constants/subscriptions');
const { User } = require('../database/models');

const checkForSub = async (ctx, next) => {
	const userId = ctx.from.id;
	
	try {
		const user = await User.findByPk(userId);

		if (user.tariff === NONE) {
			ctx.reply('Ви не оплатили підписку');
			ctx.scene.enter(SUBSCRIPTION_SCENE);
		} else {
			next();
		}
	} catch (error) {
		console.log("Произошла ошибка при проверке подписки: ", error);
	}
};

module.exports = { checkForSub };