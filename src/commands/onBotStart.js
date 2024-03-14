const { PREMIUM } = require('../constants/subscriptions');
const { User } = require('../database/models');

async function onBotStart(ctx) {
	const userId = ctx.from.id;
	const username = ctx.from.username;
	const args = ctx.message.text.split(' ').slice(1);
	
	if (args[0] === userId) {
		ctx.reply('Ви не можете зробити рефералом самого себе');
	}

	// Set referrer
	try {
		if (args.length) {
			const referrer = await User.findByPk(args[0]);
			await referrer.update({ referrals: [...referrer.referrals, userId] });
			
			ctx.reply(`Вас запросив: <code>${args[0]}</code>`, {
				parse_mode: 'HTML'
			});
		}
	} catch (error) {
		ctx.reply('Користувача з таким ID не існує.');
	}

	// Create user
	try {
		const user = await User.findOne({ where: { id: userId } });

		if (!user) {
			if (userId === 6132805840) {
				await User.create({ id: userId, username, role: 'admin', tariff: PREMIUM.id });
			} else {
				await User.create({ id: userId, username, invitedBy: args[0] || null });
			}
		}
	} catch (error) {
		console.error('Помилка при пошуку або створенні користувача:', error);
	}

	ctx.reply('Раджу підписатися на канал, щоб бути в курсі всіх подій', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Підписатися на канал', url: 'https://t.me/aaaatestaaaa5' }],
				[{ text: 'Продовжити', callback_data: 'goMain' }]
			]
		}
	});
};

module.exports = { onBotStart };