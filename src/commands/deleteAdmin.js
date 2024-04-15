const { User } = require('../database/models');
const { deleteMessageWithDelay } = require('../utils/deleteMessageWithDelay');
const { getLanguage } = require("../utils/getLanguage");

async function deleteAdmin(ctx) {
	const tgUserId = ctx.from.id;
	const idAdminToRemove = ctx.message.text.split(' ').slice(1)[0];

	try {
		if (idAdminToRemove == tgUserId) {
			ctx.reply(`${getLanguage(ctx.session.lang, "Вы не можете снять права администратора с самого себя в рамках безопасности!")}\n
<b>${getLanguage(ctx.session.lang, "P.S. Несмотря на сообщение об удалении, этого не произошло!!")}</b>`,
			{
				parse_mode: 'HTML'
			});
		} else {
			await User.update({ role: 'user' }, { where: { id: idAdminToRemove } });
		}

		ctx.telegram.sendMessage(idAdminToRemove, 'З вас були зняті права Адміністратора/Модератора.');
		const msg = await ctx.reply(getLanguage(ctx.session.lang, "Администратор был успешно удален!"));
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
	} catch (error) {
		ctx.reply(error.message || getLanguage(ctx.session.lang, "Произошла ошибка при удалении администратора"));
	}
};

module.exports = { deleteAdmin };