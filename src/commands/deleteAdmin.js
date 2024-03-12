const { User } = require('../database/models');
const { deleteMessageWithDelay } = require('../utils/deleteMessageWithDelay');

async function deleteAdmin(ctx) {
	const tgUserId = ctx.from.id;
	const idAdminToRemove = ctx.message.text.split(' ').slice(1)[0];

	try {
		if (idAdminToRemove == tgUserId) {
			ctx.reply(`Ви не можете зняти права адміністратора з самого себе в рамках безпеки!!\n
<b>P.S. Незважаючи на повідомлення про видалення, цього не сталося!!</b>`,
			{
				parse_mode: 'HTML'
			});
		} else {
			await User.update({ role: 'user' }, { where: { id: idAdminToRemove } });
		}

		ctx.telegram.sendMessage(idAdminToRemove, 'З вас були зняті права Адміністратора/Модератора.');
		const msg = await ctx.reply('Адміністратор був успішно видалений!');
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply(error.message || 'Сталася помилка при видаленні адміністратора.');
	}
};

module.exports = { deleteAdmin };