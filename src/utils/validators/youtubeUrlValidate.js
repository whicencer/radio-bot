function youtubeUrlValidate(url) {
	const pattern = /https?:\/\/(?:www\.)?youtu(?:be\.com\/(?:watch\?v=|embed\/|v\/|live\/)|\.be\/)([\w-]+)(?:\?[^&\s]*)?/

	return pattern.test(url);
};

module.exports = { youtubeUrlValidate };