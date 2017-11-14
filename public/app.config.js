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
				// TODO: declare states
				//
				//const app = Sammy('#content', function () {
				//	this.get('#/home', controller.home);
				//	this.get('#/category/:category', (context) =>
				// controller.category(context.params.category));
				// this.get('#/my-cookie', controller.myCookie);
				// this.get('#/login', controller.login);
				// this.get('#/share-new-cookie', controller.shareNewCookie);
				// this.get('#/sign-up', controller.signUp); this.get('#',
				// (context) => context.redirect('#/home')); });
				let home = {
					name                 : 'home',
					url                  : '/',
					templateUrl          : '/views/home.html',
					requireAuthentication: false
				};

				$stateProvider
					.state(home);

				$urlRouterProvider.otherwise('/');

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