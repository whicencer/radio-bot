const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
	id: {type: DataTypes.BIGINT, primaryKey: true, unique: true},
	username: {type: DataTypes.STRING},
	balance: {type: DataTypes.BIGINT, defaultValue: 0},
	invitedBy: {type: DataTypes.BIGINT, defaultValue: null, allowNull: true},
	referrals: {type: DataTypes.ARRAY(DataTypes.BIGINT), defaultValue: []},
	tariff: {type: DataTypes.STRING, defaultValue: 'none'},
	role: {type: DataTypes.STRING, defaultValue: 'user', allowNull: false},
	subExpiresAt: {type: DataTypes.DATE, defaultValue: null, allowNull: true}
});

const Resource = sequelize.define('resource', {
	id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, autoIncrement: true},
	name: {type: DataTypes.STRING},
	url: {type: DataTypes.STRING}
});

const Chat = sequelize.define('chat', {
	id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, autoIncrement: true},
	name: {type: DataTypes.STRING, allowNull: false},
	chatLink: {type: DataTypes.STRING, unique: true, allowNull: false},
	streamKey: {type: DataTypes.STRING, unique: true, allowNull: false},
	status: {type: DataTypes.STRING, defaultValue: 'off'}
});

User.hasMany(Resource, {as: 'resources', foreignKey: 'userId'});
User.hasMany(Chat, {as: 'chats', foreignKey: 'userId'});
Chat.hasMany(Resource, {as: 'resources', foreignKey: 'chatId'});

Chat.belongsTo(User, {foreignKey: 'userId'});
Resource.belongsTo(User, {foreignKey: 'userId'});
Resource.belongsTo(Chat, {foreignKey: 'chatId'});

module.exports = {
	Chat,
	User,
	Resource
};