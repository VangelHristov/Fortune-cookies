(function requestInterceptorModule() {
	'use strict';

	angular
		.module('app')
		.factory(
			'requestInterceptor',
			[
				'$state',
				'$window',
				'storageKeys',
				function requestInterceptor(
					$state,
					$window,
					storageKeys
				) {
					return {
						'request': function (config) {
								let key = $window
									.localStorage
									.getItem(storageKeys.authKey);
								config.headers['x-auth-key'] = key;

							return config;
						}
					};
				}
			]
		);
}());