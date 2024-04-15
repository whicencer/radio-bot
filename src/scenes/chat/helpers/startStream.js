const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');
const { startStreaming } = require('../../../utils/stream/startStreaming');

const startStream = async (resources, streamKey, ctx) => {
	const result = startStreaming(resources, streamKey, ctx);
	if (result === true) {
		const msg = await ctx.reply('🚀 Started!');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		return true;
	} else {
		ctx.reply(`Not found! ${getLanguage(ctx.session.lang, "Возможно стример оффлайн или ресурс был удалён")}`);
		return false;
	}
};

module.exports = { startStream };