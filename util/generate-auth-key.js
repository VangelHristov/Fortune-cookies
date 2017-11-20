'use strict';

const {
	AUTH_KEY_LENGTH,
	AUTH_KEY_CHARS
} = require('./constants');

module.exports = function generateAuthKey(uniquePart) {
	let authKey = uniquePart,
		index;

	while (authKey.length < AUTH_KEY_LENGTH) {
		index = Math.floor(Math.random() * AUTH_KEY_LENGTH);
		authKey += AUTH_KEY_CHARS[index];
	}

	return authKey;
};