const { Scenes } = require('telegraf');
const { ADD_MOVIE_SCENE, LIBRARY_SCENE, ADD_SOURCE_TO_CHAT_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { deleteMessageWithDelay } = require('../../utils/deleteMessageWithDelay');
const { movieIdValidate } = require('../../utils/validators/movieIdValidate');
const { getSourceFilmix } = require('../../utils/filmix');
const { Resource } = require('../../database/models');
const { getLanguage } = require('../../utils/getLanguage');

const addMovie = new Scenes.BaseScene(ADD_MOVIE_SCENE);

addMovie.enter(ctx => {
	ctx.reply(`${getLanguage(ctx.session.lang, "Введите ID фильма с сайта")} https://www.filmix.biz\n
${getLanguage(ctx.session.lang, "Инструкция для получения ID")}: https://t.me/aaaatestaaaa5/106`, {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🚫 Cancel', callback_data: 'cancel' }]
			]
		},
		link_preview_options: {
			is_disabled: true
		}
	});
});

addMovie.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(LIBRARY_SCENE);
});

addMovie.on('message', async (ctx) => {
	const code = ctx.message.text;
	const userId = ctx.from.id;

	if (!movieIdValidate(code)) {
		ctx.reply(getLanguage(ctx.session.lang, "Неверный формат!"));
	} else {
		const loadMsg = await ctx.reply('Loading...');
		try {
			const { sourceUrl, title } = await getSourceFilmix(code);
			const createdSource = await Resource.create({ userId, name: `${title} (Filmix)`, url: sourceUrl });
			
			const msg = await ctx.reply('✅ Success!');
			
			ctx.scene.enter(ADD_SOURCE_TO_CHAT_SCENE, { createdSource });
			deleteMessageWithDelay(ctx, msg.message_id, 3000);
		} catch (error) {
			ctx.reply('❌ Error while adding source. Please try again later.');
			ctx.scene.enter(LIBRARY_SCENE);
			console.log("Ошибка при добавлении ресурса: ", error);
		} finally {
			deleteMessageWithDelay(ctx, loadMsg.message_id, 0);
		}
	}
});

module.exports = { addMovie };