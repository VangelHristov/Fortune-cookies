(function myCookieControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('MyCookieController', [
			'$scope',
			'$state',
			'fortuneCookies',
			function MyCookieController($scope, $state, fortuneCookies) {
				fortuneCookies
					.getMyCookie()
					.then(myCookie => {
						$scope.myCookie = myCookie;
					})
					.catch(() => {
						$state.go('home');
					});

				$scope.rate = fortuneCookies.rate;
			}
		]);
}());