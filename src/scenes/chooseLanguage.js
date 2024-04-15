const { Scenes } = require("telegraf");
const { MAIN_SCENE } = require("../constants/scenes");

const chooseLanguage = new Scenes.BaseScene('chooseLanguage');

chooseLanguage.enter(ctx => {
  ctx.reply('Виберіть мову', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Українська', callback_data: 'ua' }],
        [{ text: 'English', callback_data: 'en' }],
        [{ text: 'Русский', callback_data: 'ru' }],
      ]
    }
  });
});

chooseLanguage.action('ua', ctx => {
  ctx.session.lang = 'ua';
  ctx.scene.enter(MAIN_SCENE);
});

chooseLanguage.action('en', ctx => {
  ctx.session.lang = 'en';
  ctx.scene.enter(MAIN_SCENE);
});

chooseLanguage.action('ru', ctx => {
  ctx.session.lang = 'ru';
  ctx.scene.enter(MAIN_SCENE);
});

module.exports = { chooseLanguage };