const { ALL_CHATS_SCENE } = require('../../../constants/scenes');
const { Chat } = require('../../../database/models');
const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');

const deleteChat = async (id, ctx) => {
	try {
		const chatToDelete = await Chat.findOne({ where: { id } });

		await ctx.scene.enter(ALL_CHATS_SCENE);

		Chat.destroy({ where: { id } });

		const msg = await ctx.reply(`✅ Канал ${chatToDelete.name} був успішно видалений!`);
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply('❌ Виникла помилка при видаленні каналу');
		console.log('Error while deleting chat: ', error);
	}
};

module.exports = { deleteChat };