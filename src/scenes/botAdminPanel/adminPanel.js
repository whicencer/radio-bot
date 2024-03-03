const { Scenes } = require('telegraf');
const { ADMIN_PANEL_SCENE, ADD_ADMIN_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');

const adminPanel = new Scenes.BaseScene(ADMIN_PANEL_SCENE);

adminPanel.enter(ctx => {
	const userName = ctx.from.first_name;

	ctx.reply(`Добро пожаловать в админ панель бота, <b>${userName}</b>!`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: '📋 Список админов', callback_data: 'admin_list' }],
				[{ text: '🔧 Добавить админа', callback_data: 'add_admin' }],
				[{ text: '⚙️ Добавить модератора', callback_data: 'test' }],
				[{ text: '👥 Управление пользователями', callback_data: 'test' }],
			]
		},
		parse_mode: 'HTML'
	});
});

adminPanel.action('admin_list', async (ctx) => {
	const currentUserId = ctx.from.id;
	const allAdmins = await User.findAll({ where: { role: 'admin' } });
	const admins = allAdmins.map(admin => {
		return admin.id == currentUserId
			? `@${admin.username} (${admin.id}) (Вы)`
			: `@${admin.username} (${admin.id})`;
	});

	ctx.reply(`Все администраторы бота:\n${admins.join('\n')}\n
Для удаления администратора введите команду <code>/delete_admin {id_пользователя}</code>`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: '⬇️ Скрыть сообщение', callback_data: 'hide' }]
			]
		},
		parse_mode: 'HTML'
	});
});

adminPanel.action('hide', ctx => {
	deleteLastMessage(ctx);
});

adminPanel.action('add_admin', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_ADMIN_SCENE);
});

module.exports = { adminPanel };