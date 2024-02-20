function rtmpKeyValidate(url) {
	const pattern = /^\d+:[\w-]+$/;

	if (!pattern.test(url)) {
		throw new Error('Некорректный ключ сервера');
	}

	return true;
}

module.exports = { rtmpKeyValidate };