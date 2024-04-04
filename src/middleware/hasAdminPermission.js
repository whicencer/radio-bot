const { User } = require('../database/models');

const hasAdminPermission = async (ctx, next) => {
	const userId = ctx.from.id;
	
	try {
		const { role } = await User.findByPk(userId);

		const userHasPermission = role === 'admin';

		if (userHasPermission) {
			next();
		} else {
			ctx.reply('У вас немає доступу до цієї команди!');
		}
	} catch (error) {
		console.log("Произошла ошибка при проверке прав: ", error);
	}
}

module.exports = { hasAdminPermission };