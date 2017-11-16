(function userControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller(
			'UserController',
			[
				'$scope',
				'$state',
				'userAuth',
				function userController(
					$scope,
					$state,
					userAuth
				) {
					$scope.category = '';
					$scope.usernameRegx = /^[A-Za-z0-9._]{6,30}/;
					$scope.passwordRegx = /^[^\s]{6,}$/;

					$scope.user = {
						username: '',
						password: ''
					};

					$scope.displayName = userAuth.getUsername();

					$scope.logIn = function ligIn() {
						userAuth
							.logIn($scope.user)
							.then(() => $state.go('home'));
					};

					$scope.register = function register() {
						userAuth
							.register($scope.user)
							.then(() => $state.go('login'));
					};

					$scope.logout = userAuth.logOut;

					$scope.isLoggedIn = userAuth.isLoggedIn;
				}
			]
		);
}());