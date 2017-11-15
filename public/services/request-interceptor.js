(function requestInterceptorModule() {
	'use strict';

	angular
		.module('app')
		.factory(
			'requestInterceptor',
			[
				'$state',
				'$window',
				'userData',
				'notification',
				function requestInterceptor(
					$state,
					$window,
					userData,
					notification
				) {
					return {
						request: function (config) {
							if ($state.reqireAuthentication === true) {
								let key = $window.localStorage.getItem(userData.authKey);
								if (key === null) {
									$state.go('home');
									notification.error('Please login');

									return;
								}

								config.headers['x-auth-key'] = key;
							}

							return config;
						}
					};
				}
			]
		);
}());