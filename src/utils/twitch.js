const { default: axios } = require('axios');

async function getSourceUrlTwitch(twitch_url) {
  try {
    const response = await axios.get(`https://streamlink-api.onrender.com/get_stream_url?channel=${twitch_url}`);
    const data = response.data;
    
    if (!data.error) {
      return data.stream_url;
    }
  } catch (error) {
    console.log('Error while getting source url');
  }
}

module.exports = { getSourceUrlTwitch };