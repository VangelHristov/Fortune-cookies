(function fortuneCookiesModule() {
	'use strict';

	angular
		.module('app')
		.factory('fortuneCookies', [
			'dataContext',
			function fortuneCookies(dataContext) {
				let filter = function (col, cat) {
					return col.filter(function f(e) {
						return e.category.toLowerCase() === cat.toLowerCase();
					});
				};

				return {
					getAll       : function () {
						return dataContext
							.cookies
							.get()
							.$promise
							.then(res => Promise.resolve(res.result))
							.catch(err => Promise.reject(err));
					},
					share        : function (cookie) {
						return dataContext
							.cookies
							.save(cookie)
							.$promise
							.then(() => Promise.resolve())
							.catch(err => Promise.reject(err));

					},
					getByCategory: function (category) {
						return dataContext
							.cookies
							.get()
							.$promise
							.then(res => Promise.resolve(filter(
								res.result,
								category
							)))
							.catch(err => Promise.reject(err));
					},
					getMyCookie  : function () {
						return dataContext
							.myCookie
							.get()
							.$promise
							.then(res => Promise.resolve(res.result))
							.catch(err => Promise.reject(err));
					}
				};
			}
		]);
}());