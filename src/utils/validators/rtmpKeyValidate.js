function rtmpKeyValidate(key) {
	const pattern = /^\d+:[\w-]+$/;

	if (!pattern.test(key)) {
		throw new Error('Некорректный ключ сервера');
	}

	return true;
}

module.exports = { rtmpKeyValidate };