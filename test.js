const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const youtubeVideoIds = [
	'IB8W81zAkAI',
	'NoIPDW5Zk-k',
];

// Функция для загрузки YouTube видео на сервер
async function downloadYouTubeVideo(videoId, filename) {
    const videoReadableStream = ytdl(videoId, { filter: 'audioandvideo' });
    const fileWriteStream = fs.createWriteStream(filename);

    videoReadableStream.pipe(fileWriteStream);

    return new Promise((resolve, reject) => {
        fileWriteStream.on('finish', resolve);
        fileWriteStream.on('error', reject);
    });
}

function deleteTemporaryFiles() {
	youtubeVideoIds.forEach((videoId) => {
		const filename = `video_${videoId}.mp4`;
		fs.unlink(filename, (err) => {
			if (err) {
				console.error(`Error deleting file ${filename}:`, err);
			} else {
				console.log(`File ${filename} deleted successfully`);
			}
		});
	});
}

// Функция для трансляции видео с сервера на RTMP
function streamLocalFileToRTMPServer(localFilePath, rtmpServerURL) {
	ffmpeg(localFilePath)
		.inputOptions(['-re', '-stream_loop -1'])
		.outputOptions(['-c:v copy', '-c:a copy'])
		.format('flv')
		.output(rtmpServerURL)
		.on('end', () => {
			console.log('Transcoding succeeded !');
		})
		.on('error', (err) => {
			console.error('Error during transcoding:', err);
		})
		.run();
}

// Пример использования
const rtmpServerURL = 'rtmps://dc4-1.rtmp.t.me/s/1993069849:_TcfFzvkmN-sFHZIYVr41g';

async function downloadAllVideos() {
	const downloadedFiles = [];

	for (let i = 0; i < youtubeVideoIds.length; i++) {
		const videoId = youtubeVideoIds[i];
		const filename = `video_${videoId}.mp4`;
		await downloadYouTubeVideo(videoId, filename);
		downloadedFiles.push(filename);
	}

	return downloadedFiles;
}

function concatenateVideos(videoFiles, outputFilename) {
	return new Promise((resolve, reject) => {
		const ffmpegCommand = ffmpeg();

		videoFiles.forEach((file) => {
			ffmpegCommand.input(file);
		});

		ffmpegCommand.on('end', () => {
			console.log('Video concatenation succeeded !');
			deleteTemporaryFiles();
			resolve();
		})
		.on('error', (err) => {
			console.error('Error during video concatenation:', err);
			reject(err);
		})
		.mergeToFile(outputFilename);
	});
}

async function main() {
	const outputFilename = 'concatenated_video.mp4';
	const downloadedFiles = await downloadAllVideos();
	await concatenateVideos(downloadedFiles, outputFilename);
}

main();