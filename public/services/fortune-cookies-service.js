(function fortuneCookiesModule() {
	'use strict';

	angular
		.module('app')
		.factory('fortuneCookies', [
			'dataContext',
			'notification',
			function fortuneCookies(dataContext, notification) {
				return {
					getAll       : function () {
						return dataContext
							.cookies
							.get()
							.$promise
							.then(res => res.result)
							.catch(err => notification.error(err));
					},
					rate         : function (cookie) {
						dataContext
							.cookies
							.rate(
								{id: cookie.id},
								cookie
							)
							.$promise
							.then(function rateSuccess() {
								notification
									.success('Your rating was submitted');

								return Promise.resolve();
							})
							.catch(error => notification.error(error));
					},
					share        : function (cookie) {
						dataContext
							.cookies
							.save(cookie)
							.$promise
							.then(function shareSuccess() {
								notification.success(
									'You shared a fortune cookie');

								return Promise.resolve();
							})
							.catch(error => notification.error(error));

					},
					getByCategory: function (category) {
						return dataContext
							.cookies
							.get()
							.$promise
							.then((res) => {
								let filtered =
									res.result
									   .filter(
										   function filter(c) {
											   return c.category.toLowerCase() === category.toLowerCase();
										   });

								return Promise.resolve(filtered);
							})
							.catch(err => notification.error(err));
					},
					getCategories: function () {
						return dataContext
							.categories
							.get()
							.$promise
							.then(res => Promise.resolve(res.result))
							.catch(err => notification.error(err));
					},
					getMyCookie  : function () {
						return dataContext
							.myCookie
							.get()
							.$promise
							.then(res => Promise.resolve(res.result))
							.catch(err => {
								notification.error(err);
								return Promise.reject();
							});
					}
				};
			}
		]);
}());