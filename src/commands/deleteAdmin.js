const { userRoles } = require('../constants/userRoles');
const { User } = require('../database/models');
const { deleteMessageWithDelay } = require('../utils/deleteMessageWithDelay');

async function deleteAdmin(ctx) {
	const tgUserId = ctx.from.id;
	const idAdminToRemove = ctx.message.text.split(' ').slice(1)[0];

	const { role } = await User.findByPk(tgUserId);
	const userHasPermission = role === 'admin';

	if (userHasPermission) {
		try {
			if (idAdminToRemove == tgUserId) {
				ctx.reply(`Вы не можете снять права администратора с самого себя в рамках безопасности!\n
<b>P.S. Несмотря на сообщение об удалении, этого не произошло!!</b>`,
				{
					parse_mode: 'HTML'
				});
			} else {
				await User.update({ role: 'user' }, { where: { id: idAdminToRemove } });
			}

			ctx.telegram.sendMessage(idAdminToRemove, 'С вас были сняты права Администратора/Модератора');
			const msg = await ctx.reply('Администратор был успешно удален!');
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			ctx.reply(error.message || 'Произошла ошибка при удалении администратора');
		}
	} else {
		ctx.reply('У вас нет доступа к этой команде!');
	}
};

module.exports = { deleteAdmin };