// const fs = require('fs');
// const ytdl = require('ytdl-core');
// const ffmpeg = require('fluent-ffmpeg');

// const youtubeVideoIds = [
// 	'IB8W81zAkAI',
// 	'NoIPDW5Zk-k',
// ];

// // Функция для загрузки YouTube видео на сервер
// async function downloadYouTubeVideo(videoId, filename) {
//     const videoReadableStream = ytdl(videoId, { filter: 'audioandvideo' });
//     const fileWriteStream = fs.createWriteStream(filename);

//     videoReadableStream.pipe(fileWriteStream);

//     return new Promise((resolve, reject) => {
//         fileWriteStream.on('finish', resolve);
//         fileWriteStream.on('error', reject);
//     });
// }

// function deleteTemporaryFiles() {
// 	youtubeVideoIds.forEach((videoId) => {
// 		const filename = `video_${videoId}.mp4`;
// 		fs.unlink(filename, (err) => {
// 			if (err) {
// 				console.error(`Error deleting file ${filename}:`, err);
// 			} else {
// 				console.log(`File ${filename} deleted successfully`);
// 			}
// 		});
// 	});
// }

// // Функция для трансляции видео с сервера на RTMP
// function streamLocalFileToRTMPServer(localFilePath, rtmpServerURL) {
// 	ffmpeg(localFilePath)
// 		.inputOptions(['-re', '-stream_loop -1'])
		// .outputOptions(['-c:v copy', '-c:a copy'])
		// .format('flv')
// 		.output(rtmpServerURL)
// 		.on('end', () => {
// 			console.log('Transcoding succeeded !');
// 		})
// 		.on('error', (err) => {
// 			console.error('Error during transcoding:', err);
// 		})
// 		.run();
// }

// // Пример использования
// const rtmpServerURL = 'rtmps://dc4-1.rtmp.t.me/s/1993069849:_TcfFzvkmN-sFHZIYVr41g';

// async function downloadAllVideos() {
// 	const downloadedFiles = [];

// 	for (let i = 0; i < youtubeVideoIds.length; i++) {
// 		const videoId = youtubeVideoIds[i];
// 		const filename = `video_${videoId}.mp4`;
// 		await downloadYouTubeVideo(videoId, filename);
// 		downloadedFiles.push(filename);
// 	}

// 	return downloadedFiles;
// }

// function concatenateVideos(videoFiles, outputFilename) {
// 	return new Promise((resolve, reject) => {
// 		const ffmpegCommand = ffmpeg();

// 		videoFiles.forEach((file) => {
// 			ffmpegCommand.input(file);
// 		});

// 		ffmpegCommand.on('end', () => {
// 			console.log('Video concatenation succeeded !');
// 			deleteTemporaryFiles();
// 			resolve();
// 		})
// 		.on('error', (err) => {
// 			console.error('Error during video concatenation:', err);
// 			reject(err);
// 		})
// 		.mergeToFile(outputFilename);
// 	});
// }

// async function main() {
// 	const outputFilename = 'concatenated_video.mp4';
// 	const downloadedFiles = await downloadAllVideos();
// 	await concatenateVideos(downloadedFiles, outputFilename);
// }

// main();

//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////


const ffmpeg = require('fluent-ffmpeg');

// Список ресурсов для трансляции (видео и аудио)
const resources = [
	// { url: 'https://rr4---sn-i5heen7d.googlevideo.com/videoplayback?expire=1709259403&ei=K-bgZambIb636dsPn6C_0AM&ip=2a01%3Ac23%3A9052%3A5800%3A9523%3A3183%3A882b%3A6c44&id=o-AJMus5zTln0BHB38LpGSwq0YAtDvA747X9UKtZusGlgZ&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Fm&mm=31%2C29&mn=sn-i5heen7d%2Csn-i5h7lnll&ms=au%2Crdu&mv=m&mvi=4&pl=39&initcwndbps=1256250&spc=UWF9f0_6ASlq8BjmkGm2pecGRIfEQ5ux80jdI4VqWsErxfk&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=200.295&lmt=1681680415182893&mt=1709237579&fvip=3&fexp=24007246&c=ANDROID&txp=5432434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgD_2BcACwDAjctnLOBgYcGSjxLFA7LgWvMX0F7B7zPlsCIQC6VXkvMJHRIp4MXOtHehJNtRO4Iw83zTqWfW8qxeD0fw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRQIhALKFFzkI0inMVYyqE1iT66jved_I_Dr7KaZ4T8QA6K3IAiAJTG6pogCZQIDgNW5bESV1g7vY1ooFNOtVfsTT1gUqPw%3D%3D' },
	{ url: 'https://rr5---sn-i5h7lnls.googlevideo.com/videoplayback?expire=1709246509&ei=zbPgZa_oN-bB6dsP_LOL4Aw&ip=2a01%3Ac23%3A9052%3A5800%3A9523%3A3183%3A882b%3A6c44&id=o-AHdqstxCYQD3VAc8ge8CGm16-11Q-283mkYA31xTQ01J&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=pL&mm=31%2C29&mn=sn-i5h7lnls%2Csn-i5heen7r&ms=au%2Crdu&mv=m&mvi=5&pl=39&initcwndbps=1312500&spc=UWF9fzbZSbZ8dd14ub793VVZM0ogeNjgbdjIxVDPclfBg-8&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=136.974&lmt=1709204821624507&mt=1709224376&fvip=5&fexp=24007246&c=ANDROID&txp=5532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIhAMyqs7L63ZRjBn4SEDexH-emYHD9b792qk7-NvKFW7KWAiAS8muuF311_1Nyfy_6e5S5fv0sVekDmc8sUzW8vycyTQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRQIhAIoUYKweFI7l6_Z-0zKpdGXthm2eqSQuTBxoNJOoMj0pAiBu4ni6fSadBixeD2mw10_tmandSJjsQiHGzcPItrJfuA%3D%3D' },
	{ url: 'https://video-weaver.fra05.hls.ttvnw.net/v1/playlist/CuoFrMKrWqM_eWwNaD6XdQBba1-A13WOXmAoLYMOCxS-8uLBysvbshTljKwHXGMxHvKXhS5lkFGk95SRJcXQVW7JORHcCIToWcj_C9uwdVxqppRYAoFiB7VM92cg-Cm71Ev5meA2u8ZMKtQ1_XSB8wd019SLcqjU75KXvfBE8jmr_xvv1CC3LWR-6XK94LC3jySbhwyyE_yUST8uoPe_QC2xjH2jpvTDlFDoG9XfXQIUhadEVlP-a6mYwsO0J7vXe-vYqk57qopaI9A1ToKNAY7uQ5pFTWACCrHg0KwyPJ5mHH8wjNP6xXLg8PsJyzoqKsCgzvnHRngEt6Zp3nYDF8AFO8va2yEG24k9LYQYLx059HXxvyQKOwgXHO0tkRWtUj3mJSGTIUUD6aY4P79zMBlMpwPs0n9_0pulB_8NaHVinGCCjC_lJggKRROkdU7R4o5jfAuClvcQzvYw95kJrL7OaydEk9D6FKOOxEAum7JptIdEcVRKfrP8768n4LXt721JwpOFJrDRFS4ZrVOg_6BEvW2uXxUiioqifJBuo-xSMNzkjdXvR69wwGkv6hXaT6LIXa7IiS-8HlugfOffHJm5U9mFxWd1VhCsXX-D2GKgKwaW5ecNHGkYiABvdmI4fsMpE8W6bGIWtOrmYvH621WN2D8q5xcf9iIaWYhMfaX6jEj9YAd2lLjOU1IYGDTavCyYxsx2S1aqxuaCQ7DvSvIOStDfkhUGoDoYTq1XjCr29oJsHx79fbI1ALb-liS7XcWZCwfgxsV8D9xoHSkzAn5OJAHWsQqcvH4Er-Rl4jsx43OUpdAMPk9hLuuJqfY0GQZ3_nu9V9O7A5gnzItRrbduRW06AC0p0YUzxv8r9DfFv6SXyjw5rteWYF8b95nhsweyY9sstzo9lcNsfG_z--69bItI9cxmReghlgnQQnmjyFSdk2AvTJg9v_CcrrMtDE4H9MN59zTlnO_W1vDOngBbIAazfBlXsuWjPvsaDNrd1u-AnorDqOBupyABKglldS13ZXN0LTIw6wg.m3u8' },
	// Добавьте другие ресурсы по аналогии
];

// Функция для циклической трансляции ресурсов
function startStreaming() {
	let currentIndex = 0;

	function streamNext() {
		const resource = resources[currentIndex];
		if (!resource) {
			// Если достигнут конец списка ресурсов, начните сначала
			currentIndex = 0;
			streamNext();
		} else {
			let command;
			command = ffmpeg(resource.url)
					.inputOptions('-re') // Установить скорость чтения в реальном времени для аудио
					.outputOptions(['-c:v copy', '-c:a aac'])
					.format('flv')
					.output('rtmps://dc4-1.rtmp.t.me/s/2018164722:W2_gL8P5769rZnFFO1ri6Q')
					.on('error', (err) => {
						console.error('Ошибка трансляции:', err);
						currentIndex++;
						streamNext();
					})
					.on('start', () => {
						console.log('start' + currentIndex);
					})
					.on('end', () => {
						console.log('end source');
						// Перейти к следующему ресурсу после окончания текущего
						currentIndex++;
						streamNext();
					});

			command.run();
		}
	}

	streamNext();
}

// Начать циклическую трансляцию
startStreaming();