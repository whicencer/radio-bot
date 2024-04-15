const { User } = require('../database/models');
const { getLanguage } = require('../utils/getLanguage');

const hasAdminPermission = async (ctx, next) => {
	const userId = ctx.from.id;
	
	try {
		const { role } = await User.findByPk(userId);

		const userHasPermission = role === 'admin';

		if (userHasPermission) {
			next();
		} else {
			ctx.reply(getLanguage(ctx.session.lang, "У вас нет доступа к этой команде!"));
		}
	} catch (error) {
		console.log("Произошла ошибка при проверке прав: ", error);
	}
}

module.exports = { hasAdminPermission };