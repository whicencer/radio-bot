const deleteLastMessage = async (ctx) => {
	try {
		return ctx.deleteMessage(ctx.session.lastMessageId);
	} catch (error) {
		console.log("Ошибка при удалении последнего сообщения (на клиенте все ок): ", error);
	}
}

module.exports = { deleteLastMessage };