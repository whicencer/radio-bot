const { getSourceTitle } = require('./youtube');
const { Resource: ResourceModel } = require('../database/models');

async function createYoutubeSource(url, userId) {
	try {
		const sourceTitle = await getSourceTitle(url);
		
		try {
			await ResourceModel.create({ userId, name: sourceTitle, url });
		} catch (error) {
			throw new Error();
		}
	} catch (error) {
		throw new Error('❌ Произошла ошибка при добавлении ресурса.\n\nТакой ресурс уже существует или Вы ввели ссылку неверно');
	}
}

module.exports = {createYoutubeSource};