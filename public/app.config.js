(function appConfigModule() {
	'use strict';

	angular
		.module('app')
		.config([
			'$stateProvider',
			'$urlServiceProvider',
			'$httpProvider',
			function appConfig(
				$stateProvider,
				$urlServiceProvider,
				$httpProvider
			) {

				$stateProvider
					.state('home', {
						url        : '/home',
						templateUrl: '/views/home.html',
						controller : 'HomeController'
					})
					.state('category', {
						url        : '/categories/:category',
						templateUrl: '/views/category.html',
						controller : 'CookiesByCategoryController'
					})
					.state('favorites', {
						url        : '/favorites',
						templateUrl: '/views/favorites.html',
						controller : 'FavoritesController',
						data       : {authenticate: true}
					})
					.state('myCookie', {
						url        : '/my-cookie',
						templateUrl: '/views/my-fortune-cookie.html',
						controller : 'MyCookieController',
						data       : {authenticate: true}
					})
					.state('share', {
						url        : '/share',
						templateUrl: '/views/share-fortune-cookie.html',
						controller : 'ShareCookieController',
						data       : {authenticate: true}
					})
					.state('login', {
						url        : '/login',
						templateUrl: '/views/login.html'
					})
					.state('register', {
						url        : '/register',
						templateUrl: '/views/register.html'
					});

				$urlServiceProvider
					.rules
					.otherwise('home');

				$httpProvider
					.interceptors
					.push('requestInterceptor');
			}
		])
		.run([
			'$rootScope',
			'$transitions',
			'notification',
			'userAuth',
			function appRun(
				$rootScope,
				$transitions,
				notification,
				userAuth
			) {
				$transitions.onBefore(
					{},
					function transitionBefore(transition) {
						// check if the state should be protected
						if (transition.to().data &&
							transition.to().data.authenticate
							&& !userAuth.isLoggedIn()) {

							notification.warn('Please log in');

							// redirect to the 'login' state
							return transition.router.stateService.target('login');
						}
					}
				);
			}
		]);
}());