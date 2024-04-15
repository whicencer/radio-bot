const { USER_PROFILE_SCENE } = require('../../../constants/scenes');
const { User } = require('../../../database/models');
const { checkPayment } = require('../../../payments/card/checkPayment');
const { topUpReferral } = require('./topUpReferral');
const { getLanguage } = require('../../../utils/getLanguage');

const PAYMENT_APPROVED = 'Approved';
const PAYMENT_EXPIRED = 'Expired';

async function checkPayments(ctx, sum, orderReference) {
	const interval = setInterval(async () => {
		const { transactionStatus } = await checkPayment(orderReference);

		if (transactionStatus === PAYMENT_APPROVED) {
			ctx.reply(`${getLanguage(ctx.session.lang, "Ваш счёт был пополнен на")} ${sum} ${getLanguage(ctx.session.lang, "долларов!")}`);
			await User.increment('balance', { by: sum, where: { id: ctx.from.id } });
			const [refId, refMsg] = await topUpReferral(ctx.from.id, sum);

			if (refId) ctx.telegram.sendMessage(refId, refMsg);

			clearInterval(interval);
			ctx.scene.enter(USER_PROFILE_SCENE);
		} else if (transactionStatus === PAYMENT_EXPIRED) {
			ctx.reply(getLanguage(ctx.session.lang, "Закончился термин оплаты"));

			clearInterval(interval);
			ctx.scene.enter(USER_PROFILE_SCENE);
		}
	}, 10000);
};

module.exports = { checkPayments };