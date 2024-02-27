const { ALL_CHATS } = require('../constants/scenes');

function getUserChats(ctx) {
	const userId = ctx.message.from.id;
	
	ctx.scene.enter(ALL_CHATS, { userId });
};

module.exports = { getUserChats };