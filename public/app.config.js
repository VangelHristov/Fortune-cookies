(function appConfigModule() {
	'use strict';

	angular
		.module('app')
		.config([
			'$stateProvider',
			'$urlRouterProvider',
			'$httpProvider',
			function appConfig(
				$stateProvider,
				$urlRouterProvider,
				$httpProvider
			) {

				$stateProvider
					.state('home', {
						url                  : '/home',
						templateUrl          : '/views/home.html',
						requireAuthentication: false,
						resolve              : {
							'cookies': [
								'dataContext',
								'notification',
								function resolveCookies(
									dataContext,
									notification
								) {

									return dataContext
										.cookies
										.get()
										.$promise
										.then(res => res.result)
										.catch(err => notification.error(err));

								}
							]
						},
						controller:'FortuneCookiesController'
					})
					.state('categories', {
						url                  : '/categories',
						templateUrl          : '/views/categories.html',
						requireAuthentication: false,
						resolve              : {
							categories: [
								'dataContext',
								'notification',
								function resolveCategories(
									dataContext,
									notification
								) {
									return dataContext
										.categories
										.get()
										.$promise
										.then(res => res.result)
										.catch(err => notification.error(err));
								}
							]
						},
						controller:'FortuneCookiesController'
					})
					.state('category', {
						url                  : '/categories/:category',
						templateUrl          : '/views/category.html',
						requireAuthentication: false,
						resolve              : {
							cookies: [
								'dataContext',
								'$stateParams',
								'notification',
								function resolveCookies(
									dataContext,
									$stateParams,
									notification
								) {
									dataContext
										.cookies
										.get()
										.$promise
										.then(function resolveCookiesSuccess(res) {
											return res.result.filter(function filterCookies(cookie) {
												return cookie.category === $stateParams.category;
											});
										})
										.catch(err => notification.error(err));
								}
							]
						},
						controller:'FortuneCookiesController'
					})
					.state('myCookie', {
						url                  : '/my-cookie',
						templateUrl          : '/views/my-fortune-cookie.html',
						requireAuthentication: true,
						controller:'FortuneCookiesController'
					})
					.state('share', {
						url                  : '/share',
						templateUrl          : '/views/share-fortune-cookie.html',
						requireAuthentication: true,
						controller:'FortuneCookiesController'
					})
					.state('login', {
						url                  : '/login',
						templateUrl          : '/views/login.html',
						requireAuthentication: false
					})
					.state('register', {
						url                  : '/register',
						templateUrl          : '/views/register.html',
						requireAuthentication: false
					});

				$urlRouterProvider.otherwise('/home');

				$httpProvider.interceptors.push('requestInterceptor');
			}
		])
		.run([
			'$rootScope',
			'$state',
			'$window',
			'userData',
			'notification',
			function appRun(
				$rootScope,
				$state,
				$window,
				userData,
				notification
			) {
				$rootScope.$on(
					'$routeChangeStart',
					function routeChange(event, requestedRoute) {

						if (requestedRoute.requireAuthentication === true &&
							!$window.localStorage.getItem(userData.authKey)) {
							event.preventDefault();
							$state.go('home');
							notification.error('You must login');
						}
					}
				);
			}
		]);
}());