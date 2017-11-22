'use strict';

const {body, param} = require('express-validator/check');
const {sanitizeBody, sanitizeParam} = require('express-validator/filter');
const constants = require('../util/constants');

let validateCookie = [
	body('text')
		.isAscii()
		.isLength({
				min: constants.COOKIE_TEXT_MIN_LENGTH,
				max: constants.COOKIE_TEXT_MAX_LENGTH
			}
		),

	sanitizeBody(['text', 'category'])
		.trim()
		.escape(),

	body('category')
		.isAscii()
		.isLength({
			min: constants.CATEGORY_MIN_LENGTH,
			max: constants.CATEGORY_MAX_LENGTH
		}),

	body('img')
		.optional({checkFalsy: true})
		.isURL()
];

let validateUser = [
	body('username')
		.isAscii()
		.isAlphanumeric('en-US')
		.isLength({
			min: constants.USERNAME_MIN_LENGTH,
			max: constants.USERNAME_MAX_LENGTH
		}),

	body('passHash')
		.isMD5()
];

let validateCookieId = [
	sanitizeParam('cookieId')
		.trim()
		.whitelist(constants.COOKIE_ID_KEY_CHARS),

	param('cookieId')
		.isAscii()
		.isAlphanumeric('en-US')
		.isLength({
			min:constants.COOKIE_ID_KEY_LENGTH,
			max:constants.COOKIE_ID_KEY_LENGTH
		})
];

module.exports = {
	validateCookie,
	validateCookieId,
	validateUser
};