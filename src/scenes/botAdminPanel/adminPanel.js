const { Scenes } = require('telegraf');
const { ADMIN_PANEL_SCENE, ADD_ADMIN_SCENE, ADD_MODER_SCENE, ADMIN_MANAGE_USERS_SCENE, USER_PROFILE_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');
const { Op } = require('sequelize');
const { userRoles } = require('../../constants/userRoles');
const { getLanguage } = require('../../utils/getLanguage');

const adminPanel = new Scenes.BaseScene(ADMIN_PANEL_SCENE);

adminPanel.enter(async (ctx) => {
	const userId = ctx.from.id;
	const userName = ctx.from.first_name;

	const { role } = await User.findByPk(userId);
	const usersCount = await User.count();
	const basicUsersCount = await User.count({ where: { role: 'user', tariff: 'basic' } });
	const advancedUsersCount = await User.count({ where: { role: 'user', tariff: 'advanced' } });
	const premiumUsersCount = await User.count({ where: { role: 'user', tariff: 'premium' } });
	const isUserAdmin = role === 'admin';

	let inline_keyboard;

	if (isUserAdmin) {
    inline_keyboard = [
			[{ text: `📋 ${getLanguage(ctx.session.lang, "Список админов")}`, callback_data: 'admin_list' }],
			[{ text: `🔧 ${getLanguage(ctx.session.lang, "Добавить админа")}`, callback_data: 'add_admin' }],
			[{ text: `⚙️ ${getLanguage(ctx.session.lang, "Добавить модератора")}`, callback_data: 'add_moderator' }],
			[{ text: `👥 ${getLanguage(ctx.session.lang, "Управление пользователями")}`, callback_data: 'manage_users' }],
    ];
	} else {
		inline_keyboard = [
			[{ text: `👥 ${getLanguage(ctx.session.lang, "Управление пользователями")}`, callback_data: 'manage_users' }],
		];
	}

	ctx.reply(`${getLanguage(ctx.session.lang, "Добро пожаловать в админ панель бота")}, <b>${userName}</b>!\n
${getLanguage(ctx.session.lang, "Всего пользователей бота")}: ${usersCount}
Basic: ${basicUsersCount}\nAdvanced: ${advancedUsersCount}\nPremium: ${premiumUsersCount}`, {
		reply_markup: {
			inline_keyboard: [
				...inline_keyboard,
				[{ text: `⬅️ ${getLanguage(ctx.session.lang, "Назад")}`, callback_data: 'back' }]
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
			? `@${admin.username || admin.id} (${admin.id}) (You, <b>${userRoles[admin.role]}</b>)`
			: `@${admin.username || admin.id} (${admin.id}) (<b>${userRoles[admin.role]}</b>)`;
	});

	ctx.reply(`${getLanguage(ctx.session.lang, "Все администраторы бота:")}\n${admins.join('\n')}\n
${getLanguage(ctx.session.lang, "Для удаления администратора введите команду")} <code>/delete_admin {user_id}</code>`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: `⬇️ ${getLanguage(ctx.session.lang, "Скрыть сообщение")}`, callback_data: 'hide' }]
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