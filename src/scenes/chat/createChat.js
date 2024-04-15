const { Scenes } = require('telegraf');
const { ALL_CHATS_SCENE, CREATE_CHAT_SCENE, BROADCAST_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { rtmpUrlValidate } = require('../../utils/validators/rtmpUrlValidate');
const { streamKeyValidate } = require('../../utils/validators/streamKeyValidate');
const { Chat } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { checkForChatLimit } = require('./middleware/checkForChatLimit');
const { checkForSub } = require('../../middleware/checkForSub');
const { getLanguage } = require('../../utils/getLanguage');

const createChat = new Scenes.BaseScene(CREATE_CHAT_SCENE);

createChat.enter(checkForSub, checkForChatLimit, async (ctx) => {
	ctx.scene.session.stage = 1;

	try {
		ctx.reply(getLanguage(ctx.session.lang, "Введите название канала (Например: <code>Radio 1</code>)"), {
			reply_markup: {
				inline_keyboard: [
					[{ text: '🚫 Cancel', callback_data: 'cancel' }]
				]
			},
			parse_mode: 'HTML'
		});
	} catch (error) {
		const msg = await ctx.reply(error.message);
		deleteMessageWithDelay(ctx, msg.message_id, 3000);
		ctx.scene.enter(BROADCAST_SCENE);
	}
});

createChat.action('cancel', ctx => {
	ctx.scene.state = {};
	ctx.scene.enter(ALL_CHATS_SCENE);
	deleteLastMessage(ctx);
});

createChat.on('message', async (ctx) => {
	const userId = ctx.from.id;
	const stage = ctx.scene.session.stage;
	const keyboard = {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Cancel', callback_data: 'cancel' }]
			]
		},
		parse_mode: 'HTML'
	};

	if (stage === 1) {
		// CHAT NAME
		ctx.scene.session.chatName = ctx.message.text;
		const chat = await Chat.findOne({ where: { name: ctx.scene.session.chatName, userId } });
		if (chat) {
			ctx.reply(getLanguage(ctx.session.lang, "Канал с таким названием уже существует"));
			return;
		}

		ctx.scene.session.stage = 2;
		ctx.reply(getLanguage(ctx.session.lang, "Отправьте ссылку на сервер трансляции (Например: <code>rtmps://your_server</code>)"), keyboard);
	} else if (stage === 2) {
		// CHAT SERVER URL
		if (!rtmpUrlValidate(ctx.message.text)) {
			ctx.reply(getLanguage(ctx.session.lang, "Неверный формат ссылки на сервер трансляции"));
			return;
		}

		ctx.scene.session.serverUrl = ctx.message.text;
		ctx.scene.session.stage = 3;
		ctx.reply(getLanguage(ctx.session.lang, "Отправьте ключ трансляции"), keyboard);
	} else if (stage === 3) {
		// CHAT STREAM KEY
		if (!streamKeyValidate(ctx.message.text)) {
			ctx.reply(getLanguage(ctx.session.lang, "Неверный формат ключа трансляции"));
			return;
		}

		ctx.scene.session.streamKey = ctx.message.text;
		ctx.scene.session.stage = 4;
		ctx.reply(getLanguage(ctx.session.lang, "Отправьте ссылку на канал (Например: <code>https://t.me/your_channel</code>)"), keyboard);
	} else if (stage === 4) {
		// CHAT LINK
		ctx.scene.session.chatLink = ctx.message.text;

		const chatName = ctx.scene.session.chatName;
		const streamUrl = ctx.scene.session.serverUrl + ctx.scene.session.streamKey;
		const chatLink = ctx.scene.session.chatLink;

		const chatByLink = await Chat.findOne({ where: { name: chatLink, userId } });
		if (chatByLink) {
			ctx.reply(getLanguage(ctx.session.lang, "Канал с таким названием уже существует"));
			return;
		}

		const chatByStreamUrl = await Chat.findOne({ where: { streamKey: streamUrl } });
		if (chatByStreamUrl) {
			ctx.reply(getLanguage(ctx.session.lang, "Канал с такой ссылкой трансляции уже существует"));
			ctx.scene.enter(CREATE_CHAT_SCENE);
			return;
		}

		// Create Chat
		try {
			await Chat.create({ userId, name: chatName, streamKey: streamUrl, chatLink});
	
			const msg = await ctx.reply('✅ Success!');
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			ctx.reply(`❌ Error while creating chat. ${error.message}`);
		} finally {
			ctx.scene.enter(ALL_CHATS_SCENE);
		}
	}
});

module.exports = { createChat };