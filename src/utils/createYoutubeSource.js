const { getSourceTitle } = require('./youtube');
const { Resource: ResourceModel } = require('../database/models');

async function createYoutubeSource(url, userId) {
	try {
		const sourceTitle = await getSourceTitle(url);
		
		ResourceModel.create({ userId, name: sourceTitle, url });
	} catch (error) {
		throw new Error('❌ Произошла ошибка при добавлении ресурса.\n\nВозможно вы ввели ссылку неверно');
	}
}

module.exports = {createYoutubeSource};