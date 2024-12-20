const ffmpeg = require('fluent-ffmpeg');
const { processes } = require('./processes');
const { Chat } = require('../../database/models');

function startStreaming(resources, rtmpKey, ctx) {
	let currentIndex = 0;
	let errorAttempts = 0;

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
						await Chat.update({ status: 'off' }, { where: { streamKey: rtmpKey } });
						processes.stopProcess(rtmpKey);
					} else if (err.message.indexOf('SIGKILL') === -1) {
						errorAttempts++;
						console.log(errorAttempts);
						if (errorAttempts >= 7) {
							console.log('Достигнут лимит попыток, трансляция остановлена');
							await Chat.update({ status: 'off' }, { where: { streamKey: rtmpKey } });
							processes.stopProcess(rtmpKey);
							ctx.reply('❌ Трансляцію було зупинено, один з ресурсів не відповідає');
              return;
						}
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