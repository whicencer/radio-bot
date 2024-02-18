const youtubedl = require('youtube-dl-exec');

function getSourceUrl(youtube_url) {
  return youtubedl(youtube_url, {
    'get-url': true,
    f: 'best',
  });
}

function getSourceTitle(youtube_url) {
  return youtubedl(youtube_url, {
    'get-title': true,
    f: 'best',
  });
}

module.exports = { getSourceUrl, getSourceTitle };