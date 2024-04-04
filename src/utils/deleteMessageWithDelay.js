const deleteMessageWithDelay = (ctx, msgId, delayInMs) => {
	setTimeout(() => {
		try {
			ctx.deleteMessage(msgId);
		} catch (error) {
      console.log("Произошла ошибка при удалении сообщения с задержкой (на клиенте всё ок): ", error);
		}
	}, delayInMs);
};

module.exports = { deleteMessageWithDelay };