const { getLanguage } = require("./getLanguage");

function formatDateDifference(targetDate, lang) {
	const day = getLanguage(lang, 'день');
	const days = getLanguage(lang, 'дней');
	const week = getLanguage(lang, 'неделю');
	const weeksTranslate = getLanguage(lang, 'недель');
	const month = getLanguage(lang, 'месяц');
	const monthsTranslate = getLanguage(lang, 'месяцев');

	const now = new Date();
	const date = new Date(targetDate);
	const diffTime = Math.abs(date - now);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	if (diffDays < 7) {
		return `${diffDays} ${diffDays === 1 ? day : days}`;
	} else if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} ${weeks === 1 ? week : weeks < 5 ? weeksTranslate : weeksTranslate}`;
	} else {
		const months = Math.floor(diffDays / 30);
		return `${months} ${months === 1 ? month : monthsTranslate}`;
	}
}

module.exports = { formatDateDifference };