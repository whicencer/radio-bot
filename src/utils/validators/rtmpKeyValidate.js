function rtmpKeyValidate(key) {
	const pattern = /^\d+:[\w-]+$/;

	return pattern.test(key);
}

module.exports = { rtmpKeyValidate };