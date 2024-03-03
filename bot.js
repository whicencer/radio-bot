require('dotenv').config();

const { Telegraf, Scenes, session } = require('telegraf');
const { MAIN_SCENE, BROADCAST_SCENE, INFORMATION_SCENE, USER_PROFILE_SCENE } = require('./src/constants/scenes');
const { onBotStart } = require('./src/commands/onBotStart');
const { allChats } = require('./src/scenes/chat/allChats');
const { chatDetailed } = require('./src/scenes/chat/chatDetailed');
const { createChat } = require('./src/scenes/chat/createChat');
const { main } = require('./src/scenes/main');
const { broadcastScene } = require('./src/scenes/broadcastScene');
const { library } = require('./src/scenes/library/library');
const { librarySource } = require('./src/scenes/library/librarySource');
const { addSource } = require('./src/scenes/addSource/addSource');
const { addYoutube } = require('./src/scenes/addSource/addYoutube');
const { addRadio } = require('./src/scenes/addSource/addRadio');
const { chatLibrary } = require('./src/scenes/chat/chatLibrary');
const { addChatLibrarySource } = require('./src/scenes/chat/addChatLibrarySource');
const { information } = require('./src/scenes/information');
const { botConfigDb } = require('./src/database/botConfigDb');
const { userProfile } = require('./src/scenes/userProfile');
const { subscription } = require('./src/scenes/subscription');
const { adminPanel } = require('./src/scenes/botAdminPanel/adminPanel');
const { addAdmin } = require('./src/scenes/botAdminPanel/addAdmin');
const { deleteAdmin } = require('./src/commands/deleteAdmin');
const { addModer } = require('./src/scenes/botAdminPanel/addModer');
const { manageUsers } = require('./src/scenes/botAdminPanel/manageUsers');
const { topupBalance } = require('./src/scenes/botAdminPanel/topupBalance');
const { setSubscription } = require('./src/scenes/botAdminPanel/setSubscription');

const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

const stage = new Scenes.Stage([
	main,
	broadcastScene,
	allChats,
	chatDetailed,
	createChat,
	library,
	librarySource,
	addSource,
	addYoutube,
	addRadio,
	chatLibrary,
	addChatLibrarySource,
	information,
	userProfile,
	subscription,
	adminPanel,
	addAdmin,
	addModer,
	manageUsers,
	topupBalance,
	setSubscription
]);

bot.use(session());
bot.use(stage.middleware());

bot.start(onBotStart);

bot.command('delete_admin', deleteAdmin);

bot.hears('👤 Профиль', ctx => {
	ctx.scene.enter(USER_PROFILE_SCENE);
});
bot.hears('📖 Информация', ctx => {
	ctx.scene.enter(INFORMATION_SCENE);
});
bot.hears('📡 Транслировать', ctx => {
	ctx.scene.enter(BROADCAST_SCENE);
});

bot.action('goMain', ctx => {
	ctx.scene.enter(MAIN_SCENE);
});

bot.launch(async () => {
	console.log('Бот запущен');
	await botConfigDb();
});