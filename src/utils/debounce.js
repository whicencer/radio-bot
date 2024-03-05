function debounce(func, wait) {
	let timeout;
	return function() {
		const context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

module.exports = { debounce };