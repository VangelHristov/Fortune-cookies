'use strict';

module.exports = function moduleExports(db) {

	let getRandomCookie = function () {
		let cookies = db('cookies')
			.value();

		let index = Math.floor(Math.random() * cookies.length);
		return cookies[index];
	}

	let get = function (req, res) {
		let user = req.user;

		if (!user) {
			return res
				.status(401)
				.json('User not authorized');
		}

		let today = new Date().getDay();
		if (user.dailyCookie.day !== today) {
			user.dailyCookie = getRandomCookie();
			user.dailyCookie.day = today;
		}

		db.save();

		return res.json({
			result: user.dailyCookie
		});
	}

	return {get};
};