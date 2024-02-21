function youtubeUrlValidate(url) {
	const pattern = /https?:\/\/(?:www\.)?youtu(?:be\.com\/(?:watch\?v=|embed\/|v\/)|\.be\/)([\w-]+)(?:\S+)?/;
	
	if (!pattern.test(url)) {
		throw new Error('Некорректная ссылка на Youtube');
	}

	return true;
};

module.exports = { youtubeUrlValidate };