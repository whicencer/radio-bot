const youtubedl = require('youtube-dl-exec');

function getSourceUrl(youtube_url) {
  youtubedl(youtube_url, {
    'get-url': true,
    f: 'best',
  }).then(a => console.log(a));
}

getSourceUrl('https://www.youtube.com/watch?v=d88oFsuDunE');