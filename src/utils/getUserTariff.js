const { capitalizeFirstLetter } = require('./capitalizeFirstLetter');
const { formatDateDifference } = require('./formatDateDifference');

const getUserTariff = (tariff, subExpiresAt) => {
	return tariff === 'none'
		? 'Відсутній'
		: `${capitalizeFirstLetter(tariff)} (закінчується через ${formatDateDifference(subExpiresAt)})`;
};

module.exports = { getUserTariff };