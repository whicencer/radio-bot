function streamKeyValidate(key) {
	const pattern = /[a-zA-Z0-9:_-]/g;

	return pattern.test(key);
}

module.exports = { streamKeyValidate };