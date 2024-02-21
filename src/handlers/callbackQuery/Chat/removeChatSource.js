const { REMOVE_CHAT_SOURCE } = require('../../../constants/callbackQueries');
const { Chat: ChatModel, Resource: ResourceModel } = require('../../../database/models');
const { removeReplyButtons } = require('../../../utils/buttons/removeReplyButtons');

async function removeChatSource(bot, msg, chatSourceIdToDelete, currentChatId) {
	const currentChat = await ChatModel.findOne({where: {id: currentChatId}});
	const chatResourceToDelete = await ResourceModel.findOne({where: { id: chatSourceIdToDelete }});

	currentChat.removeResource(chatResourceToDelete);
	removeReplyButtons(bot, msg, `${REMOVE_CHAT_SOURCE}-${chatSourceIdToDelete}-${currentChatId}`);
};

module.exports = { removeChatSource };