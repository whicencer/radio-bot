function movieIdValidate(id) {
	const pattern = /^[0-9]+/

	return pattern.test(id);
};

module.exports = { movieIdValidate };