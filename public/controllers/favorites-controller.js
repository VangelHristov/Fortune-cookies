(function favoritesControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('FavoritesController', [
			'$scope',
			'fortuneCookies',
			function favoritesController($scope, fortuneCookies) {

			fortuneCookies
					.getAll()
					.then(cookies => {
						$scope.cookies = cookies;
					});
			}
		]);
}());