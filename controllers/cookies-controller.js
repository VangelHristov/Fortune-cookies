'use strict';

let DEFAULT_COOKIE_IMAGE =
	'https://dayinthelifeofapurpleminion.files.wordpress.com/2014/12/batman-exam.jpg';

module.exports = function cookiesControllerModule(db) {
	const ID_KEY_LENGTH = 100,
		ID_KEY_CHARS = '0123456qwertyuiopasdfghjklzxcvbnmWERTYUIOPASDFGHJKLZXCVBNM';

	function generateCookieId(uniquePart) {
		let id = uniquePart,
			index;

		while (id.length < ID_KEY_LENGTH) {
			index = Math.floor(Math.random() * ID_KEY_CHARS.length);
			id += ID_KEY_CHARS[index];
		}

		return id;
	}
	//eslint-disable-next-line
	let get = function (req, res) {
		return res
			.status(200)
			.json({result: db('cookies')});
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
			.status(200)
			.json({result: cookie});
	};

	return {
		get,
		post
	};
};