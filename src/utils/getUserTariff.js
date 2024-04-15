const { capitalizeFirstLetter } = require('./capitalizeFirstLetter');
const { formatDateDifference } = require('./formatDateDifference');
const { getLanguage } = require('./getLanguage');

const getUserTariff = (tariff, subExpiresAt, lang) => {
	return tariff === 'none'
		? getLanguage(lang, 'Відсутній')
		: `${capitalizeFirstLetter(tariff)} (${getLanguage(lang, "заканчивается через")} ${formatDateDifference(subExpiresAt, lang)})`;
};

module.exports = { getUserTariff };