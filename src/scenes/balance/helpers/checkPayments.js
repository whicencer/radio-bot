const { USER_PROFILE_SCENE } = require('../../../constants/scenes');
const { User } = require('../../../database/models');
const { checkPayment } = require('../../../payments/card/checkPayment');
const { topUpReferral } = require('./topUpReferral');

const PAYMENT_APPROVED = 'Approved';
const PAYMENT_EXPIRED = 'Expired';

async function checkPayments(ctx, sum, orderReference) {
	const interval = setInterval(async () => {
		const { transactionStatus } = await checkPayment(orderReference);

		if (transactionStatus === PAYMENT_APPROVED) {
			ctx.reply(`Ваш рахунок було поповнено на ${sum} доларів!`);
			await User.increment('balance', { by: sum, where: { id: ctx.from.id } });
			const [refId, refMsg] = await topUpReferral(ctx.from.id, sum);

			if (refId) ctx.telegram.sendMessage(refId, refMsg);

			clearInterval(interval);
			ctx.scene.enter(USER_PROFILE_SCENE);
		} else if (transactionStatus === PAYMENT_EXPIRED) {
			ctx.reply('Закінчився термін оплати');

			clearInterval(interval);
			ctx.scene.enter(USER_PROFILE_SCENE);
		}
	}, 10000);
};

module.exports = { checkPayments };