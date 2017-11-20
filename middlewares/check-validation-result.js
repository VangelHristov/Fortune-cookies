'use strict';

const {validationResult} = require('express-validator/check');

module.exports = function checkValidationResultModule(req,res,next) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res
			.status(400)
			.json('Invalid value');
	}

	return next();
}