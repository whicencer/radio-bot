const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');
const { startStreaming } = require('../../../utils/stream/startStreaming');

const startStream = async (resources, streamKey, ctx) => {
	startStreaming(resources, streamKey);
	const msg = await ctx.reply(`Трансляция была запущена!`);
	deleteMessageWithDelay(ctx, msg.message_id, 3000);
};

module.exports = { startStream };