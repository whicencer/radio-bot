const { default: axios } = require('axios');

async function getSourceUrlTwitch(twitch_url) {
  try {
    const response = await axios.get(`https://pwn.sh/tools/streamapi.py?url=${twitch_url}`);
    const data = response.data;
    
    if (!data.error) {
      return data;
    }
  } catch (error) {
    console.log('Error while getting source url');
  }
}

module.exports = { getSourceUrlTwitch };