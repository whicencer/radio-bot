const getUserTariff = (tariff) => {
	return user.tariff === 'none'
		? 'Відсутній'
		: `${capitalizeFirstLetter(user.tariff)} (закінчується через ${formatDateDifference(user.subExpiresAt)})`;
};

module.exports = { getUserTariff };