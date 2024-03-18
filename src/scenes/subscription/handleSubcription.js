const { USER_PROFILE_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { subPriority } = require('../../constants/subPriority');

const handleSubcription = async (ctx, tariffName, tariffPrice) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);
	const currentTariff = user.tariff;

	if (subPriority[currentTariff] > subPriority[tariffName] || subPriority[currentTariff] === subPriority[tariffName]) {
		const msg = await ctx.reply('Ви не можете підключитися до тарифу дешевшого за ваш');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		return;
	}

	if (user.balance < tariffPrice) {
		const msg = await ctx.reply('У вас недостатньо коштів на балансі');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} else {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);

		user.update({ tariff: tariffName, subExpiresAt: date });
		user.decrement('balance', { by: tariffPrice, where: { id: userId } });
		
		await ctx.reply(`Ви підключили тариф ${tariffName} на місяць!`);

		ctx.scene.enter(USER_PROFILE_SCENE);
	}
};

module.exports = { handleSubcription };