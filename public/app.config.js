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
						url        : '/home',
						templateUrl: '/views/home.html',
						controller : 'HomeController'
					})
					.state('favorites', {
						url        : '/favorites',
						templateUrl: '/views/favorites.html',
						controller : 'FavoritesController'
					})
					.state('category', {
						url        : '/categories/:category',
						templateUrl: '/views/category.html',
						controller : 'CookiesByCategoryController'
					})
					.state('myCookie', {
						url        : '/my-cookie',
						templateUrl: '/views/my-fortune-cookie.html',
						controller : 'MyCookieController'
					})
					.state('share', {
						url        : '/share',
						templateUrl: '/views/share-fortune-cookie.html',
						controller : 'ShareCookieController'
					})
					.state('login', {
						url        : '/login',
						templateUrl: '/views/login.html'
					})
					.state('register', {
						url        : '/register',
						templateUrl: '/views/register.html'
					});

				$urlRouterProvider.otherwise('/home');

				$httpProvider
					.interceptors
					.push('requestInterceptor');
			}
		])
		.run([
			'$rootScope',
			'$state',
			'$window',
			'storageKeys',
			function appRun(
				$rootScope,
				$state,
				$window,
				storageKeys
			) {
				$rootScope.$on(
					'$locationChangeStart',
					function locationChange(event, route) {
						// User have to be authenticated to access these routes
						if (route.endsWith('/share') ||
							route.endsWith('/my-cookie')) {

							let authKey = $window
								.localStorage
								.getItem(storageKeys.authKey);

							if (!authKey) {
								event.preventDefault();
								$state.go('login');
							}
						}
					}
				);
			}
		]);
}());