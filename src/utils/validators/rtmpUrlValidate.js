function rtmpUrlValidate(key) {
	const pattern = /^(rtmps):\/\/[a-zA-Z0-9-]+\.rtmp\.t\.me\/s\/$/g;

	return pattern.test(key);
}

module.exports = { rtmpUrlValidate };