const deleteLastMessage = async (ctx) => {
	return ctx.deleteMessage(ctx.session.lastMessageId);
}

module.exports = { deleteLastMessage };