function rtmpUrlValidate(url) {
	const pattern = /^rtmps:\/\/dc4-1\.rtmp\.t\.me\/s\/\d+:[\w-]+$/;

	if (!pattern.test(url)) {
		throw new Error('Некорректная ссылка на сервер');
	}

	return true;
}

module.exports = { rtmpUrlValidate };