const { Scenes } = require('telegraf');
const { ADMIN_PANEL_SCENE, ADD_ADMIN_SCENE, ADD_MODER_SCENE, ADMIN_MANAGE_USERS_SCENE, USER_PROFILE_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');
const { Op } = require('sequelize');
const { userRoles } = require('../../constants/userRoles');

const adminPanel = new Scenes.BaseScene(ADMIN_PANEL_SCENE);

adminPanel.enter(async (ctx) => {
	const userId = ctx.from.id;
	const userName = ctx.from.first_name;

	const { role } = await User.findByPk(userId);
	const isUserAdmin = role === 'admin';

	let inline_keyboard;

	if (isUserAdmin) {
    inline_keyboard = [
			[{ text: '📋 Список админов', callback_data: 'admin_list' }],
			[{ text: '🔧 Добавить админа', callback_data: 'add_admin' }],
			[{ text: '⚙️ Добавить модератора', callback_data: 'add_moderator' }],
			[{ text: '👥 Управление пользователями', callback_data: 'manage_users' }],
    ];
	} else {
		inline_keyboard = [
			[{ text: '👥 Управление пользователями', callback_data: 'manage_users' }],
		];
	}

	ctx.reply(`Добро пожаловать в админ панель бота, <b>${userName}</b>!`, {
		reply_markup: {
			inline_keyboard: [
				...inline_keyboard,
				[{ text: '⬅️ Назад', callback_data: 'back' }]
			]
		},
		parse_mode: 'HTML'
	});
});

adminPanel.action('back', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(USER_PROFILE_SCENE);
});

adminPanel.action('admin_list', async (ctx) => {
	const currentUserId = ctx.from.id;
	const allAdmins = await User.findAll({where: {
		[Op.or]: [
			{ role: 'admin' },
			{ role: 'moderator' },
		]
	}});
	const admins = allAdmins.map(admin => {
		return admin.id == currentUserId
			? `@${admin.username} (${admin.id}) (Вы, <b>${userRoles[admin.role]}</b>)`
			: `@${admin.username} (${admin.id}) (<b>${userRoles[admin.role]}</b>)`;
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

adminPanel.action('add_moderator', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_MODER_SCENE);
});

adminPanel.action('manage_users', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADMIN_MANAGE_USERS_SCENE);
});

module.exports = { adminPanel };