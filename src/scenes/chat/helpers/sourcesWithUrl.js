const { getSourceUrl } = require('../../../utils/youtube');
const { youtubeUrlValidate } = require('../../../utils/validators/youtubeUrlValidate');
const { twitchUrlValidate } = require('../../../utils/validators/twitchUrlValidate');
const { getSourceUrlTwitch } = require('../../../utils/twitch');

const sourcesWithUrl = async (resources) => {
	const sourcesWithVideoUrl = [];
	for (const source of resources) {
		const dataValues = source.dataValues;
		if (youtubeUrlValidate(dataValues.url)) {
			const videoSourceUrl = await getSourceUrl(dataValues.url);
			sourcesWithVideoUrl.push({ ...dataValues, url: videoSourceUrl });
		} else if (twitchUrlValidate(dataValues.url)) {
			const data = await getSourceUrlTwitch(dataValues.url);
			if (data) {
				const videoSourceUrl = data.urls['720p60'];
				sourcesWithVideoUrl.push({ ...dataValues, url: videoSourceUrl });
			}
		} else {
			sourcesWithVideoUrl.push({ ...dataValues, url: dataValues.url });
		}
	}

	return sourcesWithVideoUrl;
};

module.exports = { sourcesWithUrl };