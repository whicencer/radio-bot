function generateInlineKeyboard(buttons, buttonsPerRow = 1, action, keyValueDivider) {
	const radioEntries = Object.entries(buttons);
	const inlineKeyboard = [];

	for (let i = 0; i < radioEntries.length; i += buttonsPerRow) {
		const row = radioEntries.slice(i, i + buttonsPerRow)
			.map(([key, value]) => ({ text: key, callback_data: `${action} ${key}${keyValueDivider}${value}` }));
		inlineKeyboard.push(row);
	}

	return inlineKeyboard;
};

module.exports = { generateInlineKeyboard };