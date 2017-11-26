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
							config.headers['x-auth-key'] = $window
									.localStorage
									.getItem(storageKeys.authKey);

							return config;
						}
					};
				}
			]
		);
}());