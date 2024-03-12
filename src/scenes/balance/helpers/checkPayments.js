const { USER_PROFILE_SCENE } = require('../../../constants/scenes');
const { User } = require('../../../database/models');
const { checkPayment } = require('../../../payments/card/checkPayment');

async function checkPayments(ctx, sum, orderReference) {
	const interval = setInterval(async () => {
		const { transactionStatus } = await checkPayment(orderReference);
		if (transactionStatus === 'Approved') {
			ctx.reply(`Ваш рахунок було поповнено на ${sum} доларів!`);
			await User.increment('balance', { by: sum, where: { id: ctx.from.id } });
			clearInterval(interval);
			ctx.scene.enter(USER_PROFILE_SCENE);
		} else if (transactionStatus === 'Expired') {
			ctx.reply('Закінчився термін оплати');
			clearInterval(interval);
			ctx.scene.enter(USER_PROFILE_SCENE);
		} else {
			console.log('f');
		}
	}, 10000);
};

module.exports = { checkPayments };