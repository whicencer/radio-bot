const { Scenes } = require('telegraf');
const { ALL_CHATS_SCENE, CREATE_CHAT_SCENE, BROADCAST_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { rtmpKeyValidate } = require('../../utils/validators/rtmpKeyValidate');
const { Chat } = require('../../database/models');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { checkForChatLimit } = require('./middleware/checkForChatLimit');

const createChat = new Scenes.BaseScene(CREATE_CHAT_SCENE);
const exampleMsg = `Введите название чата, ключ трансляции и его ссылку\n
Пример:
<code>Rock Radio</code>
<code>rtmps://dc4-1.rtmp.t.me/s/1694371569:_TcfFzvleD-sHZIQYVr25h</code>
<code>https://t.me/arat34t</code>
`;

createChat.enter(checkForChatLimit, async (ctx) => {
	try {
		ctx.reply(exampleMsg, {
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
	const chatInfo = ctx.message.text.split('\n');
	const [chatName, streamKey, chatLink] = chatInfo;
	
	if (chatInfo.length < 3) {
		ctx.reply('Вы ввели не все поля!');
	} else if (!rtmpKeyValidate(streamKey)) {
		ctx.reply('Неверный формат ключа трансляции');
	} else {
		try {
			await Chat.create({ userId, name: chatName, streamKey, chatLink});
	
			const msg = await ctx.reply('✅ Чат был успешно добавлен!');
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			ctx.reply(`❌ Возникла ошибка при добавлении чата: ${error.message}`);
		} finally {
			ctx.scene.enter(ALL_CHATS_SCENE);
		}
	}
});

module.exports = { createChat };