const { USER_PROFILE_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');

const handleSubcription = async (ctx, tariffName, tariffPrice) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);

	if (user.balance < tariffPrice) {
		const msg = await ctx.reply('У вас недостаточно денег на балансе');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} else if (user.tariff !== 'none') {
		const msg = await ctx.reply('Вы уже подключены. Если хотите переподключиться, обратитесь в поддержку');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} else {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);
		user.update({ tariff: tariffName, subExpiresAt: date });
		user.decrement('balance', { by: tariffPrice, where: { id: userId } });
		await ctx.reply(`Вы подключили тариф ${tariffName} на месяц!`);

		ctx.scene.enter(USER_PROFILE_SCENE);
	}
};

module.exports = { handleSubcription };