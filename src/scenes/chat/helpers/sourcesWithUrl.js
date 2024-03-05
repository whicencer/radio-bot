const { getSourceUrl } = require('../../../utils/youtube');
const { youtubeUrlValidate } = require('../../../utils/validators/youtubeUrlValidate');

const sourcesWithUrl = async (resources) => {
	const sourcesWithVideoUrl = [];
	for (const source of resources) {
		const dataValues = source.dataValues;
		if (youtubeUrlValidate(dataValues.url)) {
			const videoSourceUrl = await getSourceUrl(dataValues.url);
			sourcesWithVideoUrl.push({ ...dataValues, url: videoSourceUrl });
		} else {
			sourcesWithVideoUrl.push({ ...dataValues, url: dataValues.url });
		}
	}

	return sourcesWithVideoUrl;
};

module.exports = { sourcesWithUrl };