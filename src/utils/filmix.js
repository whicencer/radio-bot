const { default: axios } = require('axios');

async function getSourceFilmix(movieId) {
  try {
    const response = await axios.get(`https://filmix-scrapper.onrender.com/get-video/${movieId}`);
    const data = response.data;
    
    if (data !== null) {
      return { sourceUrl: data.sourceUrl, title: data.title };
    }
  } catch (error) {
    console.log('Error while getting source url');
  }
}

module.exports = { getSourceFilmix };