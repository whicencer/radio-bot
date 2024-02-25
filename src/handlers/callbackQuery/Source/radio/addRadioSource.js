const { Resource: ResourceModel } = require('../../../../database/models');
const { deleteMessage } = require('../../../../utils/messages/deleteMessage');

async function addRadioSource(bot, chatId, name, url, userId) {
	try {
		ResourceModel.create({ userId, name, url });

		const message = await bot.sendMessage(chatId, '✅ Радио было успешно добавлено!');
		setTimeout(() => {
			deleteMessage(bot, chatId, message.message_id);
		}, 3000);
	} catch (error) {
		console.log(error);
	}
};

module.exports = { addRadioSource };