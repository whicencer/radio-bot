const { PREMIUM } = require('../constants/subscriptions');
const { User } = require('../database/models');

async function onBotStart(ctx) {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const args = ctx.message.text.split(' ').slice(1);

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      if (userId === 6939013881) {
        await User.create({ id: userId, username, role: 'admin', tariff: PREMIUM.id });
      } else {
        await User.create({ id: userId, username, invitedBy: args[0] || null });
      }

      if (args.length) {
        if (args[0] == userId) {
          ctx.reply('Ви не можете зробити рефералом самого себе');
        } else {
          const referrer = await User.findByPk(args[0]);
          await referrer.update({ referrals: [...referrer.referrals, userId] });

          ctx.reply(`Вас запросив: <code>${args[0]}</code>`, {
            parse_mode: 'HTML'
          });
        }
      }
    } else {
      if (user.invitedBy) {
        ctx.reply(`Ви вже реферал користувача з ID ${user.invitedBy}`);
      }
    }
  } catch (error) {
    console.error('Ошибка при поиске или создании пользователя:', error);
  } finally {
    ctx.reply('Рекомендую підписатися на канал, щоб бути в курсі всіх подій', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Підписатися на канал', url: 'https://t.me/+lQ4S8Snj_YUwMDc0' }],
          [{ text: 'Продовжити', callback_data: 'next' }]
        ]
      }
    });
  }
}

module.exports = { onBotStart };