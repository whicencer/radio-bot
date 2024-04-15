const { USER_PROFILE_SCENE } = require('../../constants/scenes');
const { User } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { subPriority } = require('../../constants/subPriority');
const { getLanguage } = require('../../utils/getLanguage');

const handleSubcription = async (ctx, tariffName, tariffPrice) => {
	const userId = ctx.from.id;
	const user = await User.findByPk(userId);
	const currentTariff = user.tariff;

	if (subPriority[currentTariff] > subPriority[tariffName] || subPriority[currentTariff] === subPriority[tariffName]) {
		const msg = await ctx.reply(getLanguage(ctx.session.lang, "Вы не можете подключится к этому тарифу"));
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		return;
	}

	if (user.balance < tariffPrice) {
		const msg = await ctx.reply(getLanguage(ctx.session.lang, "Недостаточно средств на балансе"));
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} else {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);

		user.update({ tariff: tariffName, subExpiresAt: date });
		user.decrement('balance', { by: tariffPrice, where: { id: userId } });
		
		await ctx.reply(`${getLanguage(ctx.session.lang, "Вы подключили тариф")} ${tariffName} ${getLanguage(ctx.session.lang, "на місяць!")}`);

		ctx.scene.enter(USER_PROFILE_SCENE);
	}
};

module.exports = { handleSubcription };