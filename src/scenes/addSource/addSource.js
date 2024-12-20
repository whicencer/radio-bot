const { Scenes } = require('telegraf');
const { ADD_LIBRARY_SOURCE_SCENE, LIBRARY_SCENE, ADD_YOUTUBE_SCENE, ADD_RADIO_SCENE, ADD_TWITCH_SCENE, ADD_MOVIE_SCENE } = require('../../constants/scenes');
const { deleteLastMessage } = require('../../utils/deleteLastMessage');
const { User } = require('../../database/models');
const { BASIC, ADVANCED, PREMIUM } = require('../../constants/subscriptions');
const { checkForSub } = require('../../middleware/checkForSub');
const { getLanguage } = require('../../utils/getLanguage');

const addSource = new Scenes.BaseScene(ADD_LIBRARY_SOURCE_SCENE);

addSource.enter(checkForSub, async (ctx) => {
	const userId = ctx.from.id;
	const { tariff } = await User.findByPk(userId);

	const getSourceButtonsByTariff = (tariff) => {
    switch (tariff) {
			case BASIC.id:
				return BASIC.add_source_btns;
			case ADVANCED.id:
				return ADVANCED.add_source_btns;
			case PREMIUM.id:
				return PREMIUM.add_source_btns;
			default:
				return [];
    }
	};

	ctx.reply(getLanguage(ctx.session.lang, "Выберите источник добавления ресурса"), {
		reply_markup: {
			inline_keyboard: getSourceButtonsByTariff(tariff)
		}
	});
});

addSource.action('add_youtube', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_YOUTUBE_SCENE);
});

addSource.action('add_twitch', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_TWITCH_SCENE);
});

addSource.action('choose_radio', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_RADIO_SCENE);
});

addSource.action('add_movie', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(ADD_MOVIE_SCENE);
});

addSource.action('cancel', ctx => {
	deleteLastMessage(ctx);
	ctx.scene.enter(LIBRARY_SCENE);
});

module.exports = { addSource };