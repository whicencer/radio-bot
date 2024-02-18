const sequelize = require('./db');

async function botConfigDb() {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
	} catch (error) {
		console.log('Подключение к БД провалилось', error);
	}
}

module.exports = { botConfigDb };