(function favoritesServiceModule() {
	'use strict';

	angular
		.module('app')
		.factory('favorites', [
			'dataContext',
			function favoritesService(dataContext) {
				let get = function () {
					return dataContext
						.favorites
						.get()
						.$promise
						.then(res => Promise.resolve(res.result))
						.catch(err => Promise.reject(err));
				};

				let save = function (cookieId) {
					return dataContext
						.favorites
						.save(cookieId)
						.$promise
						.then(res => Promise.resolve(res.result))
						.catch(err => Promise.reject(err));
				};

				let del = function (cookieId) {
					return dataContext
						.favorites
						.delete(cookieId)
						.$promise
						.then(res => Promise.resolve(res.result))
						.catch(err => Promise.reject(err));
				};

				return {
					get,
					save,
					del
				};
			}
		]);
}());