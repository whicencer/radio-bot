const { Resource: ResourceModel } = require('../../../database/models');
const { deleteMessage } = require('../../../utils/messages/deleteMessage');

async function removeSource(bot, chatId, sourceId) {
	try {
		await ResourceModel.destroy({
			where: { id: sourceId }
		});
		const message = await bot.sendMessage(chatId, '✅ Ресурс был успешно удалён!');
		
		setTimeout(() => {
			deleteMessage(bot, chatId, message.message_id);
		}, 3000);
	} catch (error) {
		bot.sendMessage(chatId, '❌ Возникла ошибка при удалении ресурса');
	}
}

module.exports = { removeSource };