'use strict';

module.exports = function moduleExport(db) {
	let find = function (user) {
		if (!user) {
			return null;
		}

		return db('users')
			.find({username: user.username});
	};

	let get = function (req, res) {
		let user = find(req.user);

		if (!user) {
			return res
				.status(401)
				.json('Unauthorized');
		}

		return res
			.status(200)
			.json({result: user.favorites});
	};

	let post = function (req, res) {
		let user = find(req.user);

		if (!user) {
			return res
				.status(401)
				.json('Unauthorized');
		}

		let cookie = db('cookies')
			.find({id: req.params.cookieId});

		if (!cookie) {
			return res
				.status(400)
				.json('Invalid cookie id');
		}

		let exists = user
			.favorites
			.some(c => c.id === cookie.id);

		if (exists) {
			return res
				.status(400)
				.json('Cookie already in Favorites')
		}

		user.favorites.push(cookie);
		db.save();

		return res
			.status(200)
			.json({result: 'Cookie saved to Favorites'});
	};

	let del = function (req, res) {
		let user = find(req.user);

		if (!user) {
			return res
				.status(401)
				.json('Unauthorized');
		}

		let cookieIndex = -1;
		user.favorites.forEach(function findCookieIndex(cookie, index) {
			if (cookie.id === req.params.cookieId) {
				cookieIndex = index;
			}
		});

		if (cookieIndex > -1) {
			user.favorites.splice(cookieIndex, 1);
			db.save();
		}

		return res
			.status(200)
			.json({result: 'Cookie deleted from Favorites'});
	};

	return {
		get,
		post,
		del
	};
};