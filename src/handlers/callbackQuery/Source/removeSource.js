const { Resource: ResourceModel } = require('../../../database/models');

async function removeSource(bot, chatId, sourceId) {
	try {
		await ResourceModel.destroy({
			where: { id: sourceId }
		});
		bot.sendMessage(chatId, '✅ Ресурс был успешно удалён!');
	} catch (error) {
		bot.sendMessage(chatId, '❌ Возникла ошибка при удалении ресурса');
	}
}

module.exports = { removeSource };