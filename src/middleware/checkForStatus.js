const { Chat } = require('../database/models');
const { processes } = require('../utils/stream/processes');

const checkForStatus = async (ctx, next) => {
	const chatId = ctx.scene.state.chatId;
	const currentChat = await Chat.findOne({where: {id: chatId}});
	const isStreamActive = processes.getProcessById(currentChat.streamKey);
	
	if (isStreamActive) {
		await ctx.reply('Вы не можете сделать это действие потому что сейчас запущена трансляция!');
	} else {
		await next();
	}
}

module.exports = { checkForStatus };