(function favoritesControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('FavoritesController', [
			'$scope',
			'favorites',
			'notification',
			function favoritesController($scope, favorites, notification) {

				$scope.cookies = [];

				favorites
					.get()
					.then(cookies => {
						$scope.cookies = cookies;
					});

				$scope.deleteFromFavorites = function del(cookieId) {
					favorites
						.del({cookieId: cookieId})
						.then((res) => {
							let index = -1;

							$scope.cookies.forEach((c, ind) => {
								if (c.id === cookieId) {
									index = ind;
								}
							});
							if (index > -1) {
								$scope.cookies.splice(index, 1);
							}

							notification.success(res);
						})
						.catch(err => notification.error(err));
				}
			}
		]);
}());