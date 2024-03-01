const deleteMessageWithDelay = (ctx, msgId, delayInMs) => {
	setTimeout(() => {
		ctx.deleteMessage(msgId);
	}, delayInMs);
};

module.exports = { deleteMessageWithDelay };