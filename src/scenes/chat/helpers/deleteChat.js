const { ALL_CHATS_SCENE } = require('../../../constants/scenes');
const { Chat } = require('../../../database/models');
const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');

const deleteChat = async (id, ctx) => {
	try {
		await ctx.scene.enter(ALL_CHATS_SCENE);

		Chat.destroy({ where: { id } });

		const msg = await ctx.reply(`✅ Successfully deleted!`);
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply('❌ Error while deleting chat. Please try again later.');
		console.log('Error while deleting chat: ', error);
	}
};

module.exports = { deleteChat };