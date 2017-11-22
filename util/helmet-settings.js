'use strict';

module.exports = {
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc  : ["'self'"],
			imgSrc    : ["*"],
			scriptSrc : ["'self'"]
		}
	},
	hidePoweredBy        : {
		setTo: 'PHP 4.2.0'
	}
};