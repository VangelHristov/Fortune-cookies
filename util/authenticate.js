'use strict';

let constants = require('./constants');

module.exports = function authenticationModule(db) {
	return function authenticateMiddleware(req, res, next) {
		let key = req.headers[constants.AUTH_HEADER];
		let isString = function (obj) {
			return Object.prototype.toString.call(obj) === '[object String]';
		};

		if (key && isString(key)) {
			let keyLen = constants
				.AUTH_KEY_LENGTH
				.toString();

			let ascii = new RegExp(['^[\x00-\x7F-]{', keyLen, '}$'].join(''));
			let alphanumeric =
				new RegExp(['^[0-9A-Z-]{', keyLen, '}$'].join(''), 'i');

			if (!(ascii.test(key) && alphanumeric.test(key))) {
				return next();
			}

			req.user = db('users')
				.find({authKey: key});
		}

		return next();
	}
};