const { Chat } = require('../database/models');
const { processes } = require('../utils/stream/processes');

const checkForStatusStopped = async (ctx, next) => {
	const chatId = ctx.scene.state.chatId;
	const currentChat = await Chat.findOne({where: {id: chatId}});
	const isStreamActive = processes.getProcessById(currentChat?.streamKey) || false;
	
	if (!isStreamActive) {
		await ctx.reply('Ви не можете ще раз вимкнути трансляцію!');
	} else {
		await next();
	}
}

module.exports = { checkForStatusStopped };