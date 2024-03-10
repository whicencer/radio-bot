const { getSourceUrl } = require('../../../utils/youtube');
const { youtubeUrlValidate } = require('../../../utils/validators/youtubeUrlValidate');
const { twitchUrlValidate } = require('../../../utils/validators/twitchUrlValidate');
const { getSourceUrlTwitch } = require('../../../utils/twitch');

const sourcesWithUrl = async (resources) => {
  const sourcesWithVideoUrl = [];
  
  for (const source of resources) {
    const { url, ...otherData } = source.dataValues;

    try {
      let videoSourceUrl = url;

      if (youtubeUrlValidate(url)) {
        videoSourceUrl = await getSourceUrl(url);
      } else if (twitchUrlValidate(url)) {
        const twitchData = await getSourceUrlTwitch(url);
        videoSourceUrl = twitchData ? twitchData.urls['720p60'] || twitchData.urls['720p'] : url;
      }

      sourcesWithVideoUrl.push({ ...otherData, url: videoSourceUrl });
    } catch (error) {
      console.error(`Error processing source with URL ${url}: ${error.message}`);
      sourcesWithVideoUrl.push({ ...otherData, url });
    }
  }

  return sourcesWithVideoUrl;
};

module.exports = { sourcesWithUrl };
