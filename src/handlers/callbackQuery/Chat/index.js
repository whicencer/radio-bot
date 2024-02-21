const { addChat } = require('./addChat');
const { getCurrentChat } = require('./getCurrentChat');
const { removeChat } = require('./removeChat');
const { getChatSources } = require('./getChatSources');
const { removeChatSource } = require('./removeChatSource');
const { addChatSource } = require('./addChatSource');
const { addSelectedSource } = require('./addSelectedSource');

module.exports = {
	addChat,
	getCurrentChat,
	removeChat,
	getChatSources,
	removeChatSource,
	addChatSource,
	addSelectedSource
};