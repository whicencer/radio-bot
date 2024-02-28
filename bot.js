require('dotenv').config();

const { Telegraf, Scenes, session } = require('telegraf');
const { MAIN_SCENE, BROADCAST_SCENE } = require('./src/constants/scenes');
const { getUserProfile, onBotStart, getUserLibrary, getUserChats } = require('./src/commands');
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
	addChatLibrarySource
]);

bot.use(session());
bot.use(stage.middleware());

bot.start(onBotStart);

bot.hears('👤 Профиль', getUserProfile);
bot.hears('📖 Инструкция', ctx => {
	ctx.reply('Тут будут все инструкции, связь с менеджером и тп');
});
bot.hears('📡 Транслировать', ctx => {
	ctx.scene.enter(BROADCAST_SCENE);
});

bot.action('goMain', ctx => {
	ctx.scene.enter(MAIN_SCENE);
});

bot.launch();

// async function start() {
// 	console.log('Start');

// 	await botConfigDb();
	
// 	bot.onText(/\/start/, async (msg) => onBotStart(bot, msg));

// 	bot.onText(/👤 Профиль/, async (msg) => getUserProfile(bot, msg));

// 	bot.onText(/📀 Библиотека/, async (msg) => getUserLibrary(bot, msg));

// 	bot.onText(/💬 Чаты/, async (msg) => getUserChats(bot, msg));

// 	bot.on('callback_query', async (msg) => callbackQuery(bot, msg));

// 	bot.on('message', async (msg) => message(bot, msg));
// }

// start();



// bot.onText(/Протестировать стрим YouTube/, async (msg) => {
	// 	const chatId = msg.chat.id;
	
		// const source_url = await getSource('https://www.youtube.com/watch?v=PH-k_fqpcco');
	
		// const proccess = ffmpeg(source_url)
		// 	.inputOptions(['-re'])
		// 	.videoCodec('copy')
		// 	.audioCodec('copy')
		// 	.format('flv')
		// 	.output(rtmpUrl);
	
		// proccess.on('start', () => {
		// 	bot.sendMessage(chatId, 'Трансляция ресурса началась');
		// });
	
		// proccess.on('end', () => {
		// 	bot.sendMessage(chatId, 'Трансляция ресурса завершена');
		// });
	
		// proccess.on('error', (err) => {
		// 	bot.sendMessage(chatId, JSON.parse(err));
		// });
	
		// proccess.run();
	// });