function formatDateDifference(targetDate) {
	const now = new Date();
	const date = new Date(targetDate);
	const diffTime = Math.abs(date - now);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	if (diffDays < 7) {
		return `${diffDays} ${diffDays === 1 ? 'день' : 'дней'}`;
	} else if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} ${weeks === 1 ? 'неделя' : weeks < 5 ? 'недели' : 'недель'}`;
	} else {
		const months = Math.floor(diffDays / 30);
		return `${months} ${months === 1 ? 'месяц' : 'месяцев'}`;
	}
}

module.exports = { formatDateDifference };