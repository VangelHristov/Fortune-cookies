'use strict';

const generateAuthKey = require('../util/generate-auth-key');

module.exports = function userControllerModule(db) {

	let post = function (req, res) {
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
	};

	let put = function (req, res) {
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
	};

	return {
		post,
		put
	};
};