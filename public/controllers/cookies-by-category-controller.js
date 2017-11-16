(function cookiesByCategoryControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('CookiesByCategoryController', [
			'$scope',
			'$stateParams',
			'fortuneCookies',
			function CookiesByCategoryController(
				$scope,
				$stateParams,
				fortuneCookies
			) {
				fortuneCookies
					.getByCategory($stateParams.category)
					.then(cookies => {
						$scope.cookies = cookies;
						$scope.$parent.category = $stateParams.category;
					});

				$scope.rate = fortuneCookies.rate;

				$scope.$on('$destroy', function removeCategory() {
					$scope.$parent.category = '';
				});
			}
		]);
}());