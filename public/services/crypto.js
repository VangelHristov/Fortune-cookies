(function cryptoModule() {
	'use strict';

	angular
		.module('app')
		.factory('crypto', function crypto() {
			return {
				encrypt: function (text) {
					return 42;
				}
			};
		});
}());