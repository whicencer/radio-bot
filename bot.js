require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const {botConfigDb} = require('./src/database/botConfigDb');
const {
	callbackQuery,
	message
} = require('./src/handlers');

const {
	getUserProfile,
	onBotStart,
	getUserLibrary,
	getUserChats
} = require('./src/commands');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

async function start() {
	console.log('Start');

	await botConfigDb();
	
	bot.onText(/\/start/, async (msg) => onBotStart(bot, msg));

	bot.onText(/👤 Профиль/, async (msg) => getUserProfile(bot, msg));

	bot.onText(/📀 Библиотека/, async (msg) => getUserLibrary(bot, msg));

	bot.onText(/💬 Чаты/, async (msg) => getUserChats(bot, msg));

	bot.on('callback_query', async (msg) => callbackQuery(bot, msg));

	bot.on('message', async (msg) => message(bot, msg));
}

start();



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