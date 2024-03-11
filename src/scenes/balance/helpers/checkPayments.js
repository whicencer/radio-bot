const { USER_PROFILE_SCENE } = require('../../../constants/scenes');
const { User } = require('../../../database/models');
const { checkPayment } = require('../../../payments/card/checkPayment');

async function checkPayments(ctx, sum, orderReference) {
	const { transactionStatus } = await checkPayment(orderReference);

	if (transactionStatus === 'Approved') {
		ctx.reply(`Ваш рахунок було поповнено на ${sum} доларів!`);
		await User.increment('balance', { by: sum, where: { id: ctx.from.id } });
		ctx.scene.enter(USER_PROFILE_SCENE);
	} else if (transactionStatus === 'Expired') {
		ctx.reply('Закінчився термін оплати');
		ctx.scene.enter(USER_PROFILE_SCENE);
	} else {
		ctx.reply('Оплату не було виконано');
	}
};

module.exports = { checkPayments };