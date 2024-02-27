const ffmpeg = require('fluent-ffmpeg');
const { Chat } = require('../../database/models');

async function startStream(resources, chatId) {
	const source_url = `https://${resources[1].url}`;
	console.log(source_url);

	const proccess = ffmpeg(source_url)
		.inputOptions([
			'-re'
		])
		.audioCodec('aac')
		.audioBitrate('128k')
		.audioChannels(2)
		.audioFrequency(44100)
		.outputOptions(['-f flv'])
		.output('rtmps://dc4-1.rtmp.t.me/s/2018164722:W2_gL8P5769rZnFFO1ri6Q')
		.on('start', async function(commandLine) {
			console.log('ffmpeg запущен с командой: ' + commandLine);
			// await Chat.update({ status: 'on' }, { where: { id: chatId } });
    })
    .on('end', async function() {
			console.log('Трансляция завершена');
			await Chat.update({ status: 'off' }, { where: { id: chatId } });
    })
    .on('error', async function(err) {
			if (err.message.indexOf('SIGKILL') === -1) {
				console.error('Ошибка трансляции:', err);
			} else {
				console.log('Трансляция прервана');
			}
			await Chat.update({ status: 'off' }, { where: { id: chatId } });
    })

	proccess.run();

	return proccess;
};

module.exports = { startStream };