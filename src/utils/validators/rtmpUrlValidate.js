function rtmpUrlValidate(key) {
	const pattern = /^(rtmps):\/\/[a-zA-Z0-9-]+\.rtmp\.t\.me\/s\/[a-zA-Z0-9:_-]+$/g;

	return pattern.test(key);
}

module.exports = { rtmpUrlValidate };