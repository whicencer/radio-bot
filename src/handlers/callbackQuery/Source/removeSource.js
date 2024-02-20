const { Resource: ResourceModel } = require('../../../database/models');

async function removeSource(bot, chatId, url) {
	try {
		await ResourceModel.destroy({
			where: { url }
		});
		bot.sendMessage(chatId, '✅ Ресурс был успешно удалён!');
	} catch (error) {
		bot.sendMessage(chatId, '❌ Возникла ошибка при удалении ресурса');
	}
}

module.exports = { removeSource };