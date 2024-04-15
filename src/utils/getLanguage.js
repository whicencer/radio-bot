const { languages } = require("../../lang/lang");

const getLanguage = (lang="ua", text) => {
  return languages[lang][text];
};

module.exports = { getLanguage };