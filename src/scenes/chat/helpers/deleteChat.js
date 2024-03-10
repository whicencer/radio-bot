const { Chat } = require('../../../database/models');
const { deleteMessageWithDelay } = require('../../../utils/deleteMessageWithDelay');

const deleteChat = async (id, ctx) => {
	const chatToDelete = await Chat.findOne({ where: { id } });
	Chat.destroy({ where: { id } });

	const msg = await ctx.reply(`✅ Канал ${chatToDelete.name} був успішно видалений!`);
	deleteMessageWithDelay(ctx, msg.message_id, 3000);
};

module.exports = { deleteChat };