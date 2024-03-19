const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');
const { startStreaming } = require('../../../utils/stream/startStreaming');

const startStream = async (resources, streamKey, ctx) => {
	const result = startStreaming(resources, streamKey);
	if (result === true) {
		const msg = await ctx.reply('🚀 Трансляція була запущена!');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		return true;
	} else {
		ctx.reply('Трансльований ресурс не знайдено! Можливо стрімер оффлайн або ресурс було видалено');
		return false;
	}
};

module.exports = { startStream };