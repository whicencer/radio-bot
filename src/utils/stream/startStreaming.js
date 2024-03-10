const ffmpeg = require('fluent-ffmpeg');
const { processes } = require('./processes');
const { Chat } = require('../../database/models');

function startStreaming(resources, rtmpKey, initIndex = 0) {
	let currentIndex = initIndex;

	function streamNext() {
		const resource = resources[currentIndex];
		if (!resource) {
			currentIndex = 0;
			streamNext();
		} else {
			let command;
			command = ffmpeg(resource.url)
				.inputOptions('-re')
				.outputOptions(['-c:v copy', '-c:a aac'])
				.format('flv')
				.output(rtmpKey)
				.on('error', async (err) => {
					if (err.message.includes('404 Not Found') || err.message.includes('Failed to open') || err.message.includes('HTTP error 404')) {
						console.log('Ресурс недоступен (404), пропускаем...');
						currentIndex++;
						streamNext();
					} else if (err.message.indexOf('SIGKILL') === -1) {
						console.error('Ошибка трансляции:', err);
						currentIndex++;
						streamNext();
					} else {
						await Chat.update({ status: 'off' }, { where: { streamKey: rtmpKey } });
						console.log('Трансляция прервана');
					}
				})
				.on('start', async () => {
					await Chat.update({ status: 'on' }, { where: { streamKey: rtmpKey } });
					console.log('Трансляция началась');
				})
				.on('end', () => {
					currentIndex++;
					streamNext();
				});

			processes.addProcess(rtmpKey, command, resource.name);
			command.run();
		}
	}

	if (resources.length) {
		streamNext();
		return true;
	} else {
		return false;
	}
}

module.exports = { startStreaming };