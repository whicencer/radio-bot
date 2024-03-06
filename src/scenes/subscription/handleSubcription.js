const { USER_PROFILE_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');

const handleSubcription = async (ctx, tariffName, tariffPrice) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);

	if (user.balance < tariffPrice) {
		ctx.reply('У вас недостаточно денег на балансе');
	} else {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);
		user.update({ tariff: tariffName, subExpiresAt: date });
		user.decrement('balance', { by: tariffPrice, where: { id: userId } });
		await ctx.reply('Вы подключили тариф Basic на месяц!');

		ctx.scene.enter(USER_PROFILE_SCENE);
	}
};

module.exports = { handleSubcription };