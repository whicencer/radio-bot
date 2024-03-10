function twitchUrlValidate(url) {
	const pattern = /^https:\/\/www\.twitch\.tv\/[a-zA-Z0-9_\.]+$/;

	return pattern.test(url);
};

module.exports = { twitchUrlValidate };