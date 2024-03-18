const sequelize = require('./db');
const { Chat } = require('./models');

async function botConfigDb() {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		// await sequelize.sync({ force: true });

		Chat.update({ status: 'off' }, { where: {} });

		console.log('Подключено к базе данных. Все статусы каналов обновлены');
	} catch (error) {
		console.log('Подключение к БД провалилось', error);
	}
}

module.exports = { botConfigDb };