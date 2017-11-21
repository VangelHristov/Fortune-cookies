'use strict';

let {
	DEFAULT_COOKIE_IMAGE,
	COOKIE_ID_KEY_LENGTH,
	COOKIE_ID_KEY_CHARS
} = require('../util/constants');

module.exports = function cookiesControllerModule(db) {
	function generateCookieId(uniquePart) {
		let id = uniquePart,
			index;

		while (id.length < COOKIE_ID_KEY_LENGTH) {
			index = Math.floor(Math.random() * COOKIE_ID_KEY_CHARS.length);
			id += COOKIE_ID_KEY_CHARS[index];
		}

		return id;
	}

	let get = function (req, res) {
		return res
			.status(200)
			.json({result: db('cookies').value()});
	};

	let post = function (req, res) {
		let user = req.user;
		if (!user) {
			return res
				.status(401)
				.json('User not authorized');
		}

		let cookie = req.body;

		cookie.id = generateCookieId(user.username);
		cookie.img = cookie.img || DEFAULT_COOKIE_IMAGE;
		cookie.shareDate = new Date().toISOString();

		db('cookies')
			.insert(cookie);

		return res
			.status(201)
			.json({result: cookie});
	};

	return {
		get,
		post
	};
};