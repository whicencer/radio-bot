const { Chat: ChatModel, Resource: ResourceModel } = require('../../../database/models');
const { deleteMessage } = require('../../../utils/messages/deleteMessage');

async function addSelectedSource(bot, tgChatId, currentSourceId, currentChatId) {
	const chat = await ChatModel.findOne({where: {id: currentChatId}});
	const currentResource = await ResourceModel.findOne({where: {id: currentSourceId}});
	chat.addResource(currentResource);

	const successMsg = await bot.sendMessage(tgChatId, '✅ Ресурс был успешно добавлен в чат!');
	setTimeout(() => deleteMessage(bot, tgChatId, successMsg.message_id), 3000);
};

module.exports = { addSelectedSource };