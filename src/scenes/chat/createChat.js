const { Scenes } = require('telegraf');
const { ALL_CHATS_SCENE, CREATE_CHAT_SCENE, BROADCAST_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { rtmpUrlValidate } = require('../../utils/validators/rtmpUrlValidate');
const { Chat } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { checkForChatLimit } = require('./middleware/checkForChatLimit');
const { checkForSub } = require('../../middleware/checkForSub');

const createChat = new Scenes.BaseScene(CREATE_CHAT_SCENE);

createChat.enter(checkForSub, checkForChatLimit, async (ctx) => {
	ctx.scene.session.stage = 1;

	try {
		ctx.reply('Введите название канала (Например: <code>Radio 1</code>)', {
			reply_markup: {
				inline_keyboard: [
					[{ text: '🚫 Отменить', callback_data: 'cancel' }]
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
				[{ text: '🚫 Отменить', callback_data: 'cancel' }]
			]
		},
		parse_mode: 'HTML'
	};

	if (stage === 1) {
		ctx.scene.session.chatName = ctx.message.text;
		const chat = await Chat.findOne({ where: { name: ctx.scene.session.chatName, userId } });
		if (chat) {
			ctx.reply('Канал с таким названием уже существует');
			return;
		}

		ctx.scene.session.stage = 2;
		ctx.reply('Отправьте ссылку на сервер трансляции (Например: <code>rtmps://your_server</code>)', keyboard);
	} else if (stage === 2) {
		if (!rtmpUrlValidate(ctx.message.text)) {
			ctx.reply('Неверный формат ссылки на сервер трансляции');
			return;
		} else {
			ctx.scene.session.streamUrl = ctx.message.text;
			const chat = await Chat.findOne({ where: { name: ctx.scene.session.streamUrl } });
			if (chat) {
				ctx.reply('Канал с такой ссылкой трансляции уже существует');
				return;
			}

			ctx.scene.session.stage = 3;
			ctx.reply('Отправьте ссылку на канал (Например: <code>https://t.me/your_channel</code>)', keyboard);
		}
	} else if (stage === 3) {
		ctx.scene.session.chatLink = ctx.message.text;
		const chat = await Chat.findOne({ where: { name: ctx.scene.session.chatLink, userId } });
		if (chat) {
			ctx.reply('Канал с такой ссылкой уже существует');
			return;
		}

		const chatName = ctx.scene.session.chatName;
		const streamKey = ctx.scene.session.streamUrl;
		const chatLink = ctx.scene.session.chatLink;

		try {
			await Chat.create({ userId, name: chatName, streamKey, chatLink});
	
			const msg = await ctx.reply('✅ Канал был успешно добавлен!');
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			ctx.reply(`❌ Возникла ошибка при добавлении канала. ${error.message}`);
		} finally {
			ctx.scene.enter(ALL_CHATS_SCENE);
		}
	} else {
		ctx.reply('Поля введены неверно!');
	}
});

module.exports = { createChat };