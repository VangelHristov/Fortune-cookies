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
							if ($state.$current.name === 'myCookie' ||
								$state.$current.name === 'share') {
								let key = $window
									.localStorage
									.getItem(storageKeys.authKey);

								/* Avoid any other XHR call. Trick angular into thinking it's a GET request.
								 * This way the caching mechanism can kick in and bypass the XHR call.
								 * We return an empty response because, at this point, we do not care about the
								 * behaviour of the app. */
								if (key === null) {
									config.method = 'GET';
									config.cache = {
										get: function () {
											return null;
										}
									};

									$state.go('login');
									return config;
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