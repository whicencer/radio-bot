const { User } = require('../../../database/models');

// userId - Пользователь который совершил оплату
async function topUpReferral(userId, sum) {
	try {
		const { invitedBy } = await User.findByPk(userId);
		const { id: referralId, refPercent } = await User.findByPk(invitedBy);
		const refBonus = (sum/100)*refPercent;

		// if user has referral
		if (referralId) {
			// top up referral
			await User.increment('balance', { by: refBonus, where: { id: referralId } });

			return [referralId, `$${refBonus} Referral bonus!`];
		}
	} catch (error) {
		console.log('Error while topUpReferral: ', error);
	}
};

module.exports = { topUpReferral };