// Мидлварина которая будет проверять пользователя на наличие подписки
// И защищать ресурс от не подписанных

const { SUBSCRIPTION_SCENE } = require('../constants/scenes');
const { NONE } = require('../constants/subscriptions');
const { User } = require('../database/models');

const checkForSub = async (ctx, next) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);

	if (user.tariff === NONE) {
		ctx.reply('Вы не оплатили подписку');
		ctx.scene.enter(SUBSCRIPTION_SCENE);
	} else {
		next();
	}
};

module.exports = { checkForSub };