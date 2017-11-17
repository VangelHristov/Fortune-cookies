(function cryptoModule() {
	'use strict';

	angular
		.module('app')
		.factory('crypto', function crypto() {
			return {
				encrypt: function (text) {
					return CryptoJS.MD5(text).toString();
				}
			};
		});
}());