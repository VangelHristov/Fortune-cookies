(function categoriesControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('CategoriesController', [
			'$scope',
			'fortuneCookies',
			function CategoriesController($scope, fortuneCookies) {

			fortuneCookies
					.getCategories()
					.then(categories => {
						$scope.categories = categories;
					});
			}
		]);
}());