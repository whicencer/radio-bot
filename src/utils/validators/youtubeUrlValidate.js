function youtubeUrlValidate(url) {
	const pattern = /^https?:\/\/(?:www\.)?youtu(?:be\.com\/(?:watch\?v=|embed\/|v\/)|\.be\/)([\w-]+)(?:\?[^&\s]*)?$/

	return pattern.test(url);
};

module.exports = { youtubeUrlValidate };