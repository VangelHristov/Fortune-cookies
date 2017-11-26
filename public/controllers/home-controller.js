(function homeControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('HomeController', [
			'$scope',
			'fortuneCookies',
			function HomeController($scope, fortuneCookies) {
				$scope.order = '-shareDate';

				fortuneCookies
					.getAll()
					.then(cookies => {
						$scope.cookies = cookies;
					});
			}
		]);
}());