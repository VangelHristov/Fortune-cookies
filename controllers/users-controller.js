'use strict';

let {
	AUTH_KEY_LENGTH,
	AUTH_KEY_CHARS
} = require('../util/constants');

module.exports = function userControllerModule(db) {
	function generateAuthKey(uniquePart) {
		let authKey = uniquePart,
			index;

		while (authKey.length < AUTH_KEY_LENGTH) {
			index = Math.floor(Math.random() * AUTH_KEY_CHARS.length);
			authKey += AUTH_KEY_CHARS[index];
		}

		return authKey;
	}

	function post(req, res) {
		let user = req.body;

		if (!user ||
			typeof user.username !== 'string' ||
			typeof user.passHash !== 'string') {

			return res
				.status(400)
				.json('Invalid user');
		}

		let duplicateUser = db('users')
			.find({username: user.username});

		if (duplicateUser) {
			return res
				.status(400)
				.json('Duplicated user');
		}

		user.favorites = [];
		user.dailyCookie = {};

		db('users')
			.insert(user);

		return res
			.status(201)
			.json({result: user.username});
	}

	function put(req, res) {
		let reqUser = req.body;
		let user = db('users')
			.find({username: reqUser.username});

		if (!user || user.passHash !== reqUser.passHash) {
			return res
				.status(404)
				.json('Invalid username or password');
		}

		if (!user.authKey) {
			user.authKey = generateAuthKey(user.id);
			db.save();
		}

		return res
			.status(200)
			.json({
				result: {
					username: user.username,
					authKey : user.authKey
				}
			});
	}

	return {
		post,
		put
	};
};