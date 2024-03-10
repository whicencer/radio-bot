const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');
const { startStreaming } = require('../../../utils/stream/startStreaming');

const startStream = async (resources, streamKey, ctx) => {
	const result = startStreaming(resources, streamKey);
	if (result === true) {
		const msg = await ctx.reply(`Трансляция была запущена!`);
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		return true;
	} else {
		ctx.reply('Транслируемый ресурс не найден! Возможно стример оффлайн или ресурс был удалён');
		return false;
	}
};

module.exports = { startStream };