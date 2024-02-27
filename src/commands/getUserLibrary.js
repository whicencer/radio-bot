const { ADD_SOURCE, GET_CURRENT_SOURCE } = require('../constants/callbackQueries');
const { User } = require('../database/models');

async function getUserLibrary(ctx) {
	const userId = ctx.message.from.id;
	const user = await User.findOne({ where: {id: userId}, include: 'resources' });
	const resourcesBtns = user.resources.map(resource => ([{ text: `🎧 ${resource.name}`, callback_data: `${GET_CURRENT_SOURCE}-${resource.id}` }]));

	await ctx.reply('📀 Ваша библиотека', {
		reply_markup: {
			inline_keyboard: [
				...resourcesBtns,
				[{ text: '➕ Добавить ресурс', callback_data: ADD_SOURCE }]
			]
		}
	});
}

module.exports = { getUserLibrary };