(function mainControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller(
			'MainController',
			[
				'$scope',
				'$state',
				'$window',
				'userData',
				'dataContext',
				'notification',
				'crypto',
				function mainController(
					$scope,
					$state,
					$window,
					userData,
					dataContext,
					notification,
					crypto
				) {
					$scope.user = {};
					$scope.username = '';
					$scope.usernameRegx = /^[A-Za-z0-9._]{6,30}/;
					$scope.passwordRegx = /^[^\s]{6,}$/;

					$scope.hashPassword = function hashPassword() {
						$scope.user.passHash = crypto.encrypt($scope.user.password);
						$scope.user.password = undefined;
					};

					$scope.logIn = function logIn() {
						$scope.hashPassword();

						dataContext
							.users
							.save($scope.user)
							.$promise
							.then(function loginSuccess(res) {
								notification.success(`Welcome ${res.result.username}`);

								$window.localStorage.setItem(
									userData.name,
									res.result.username
								);
								$window.localStorage.setItem(
									userData.authKey,
									res.result.authKey
								);

								$scope.username = res.result.username;
							})
							.catch(error => notification.error(error));
					};

					$scope.logOut = function logOut() {
						$scope.username = '';

						$window.localStorage.removeItem(userData.name);
						$window.localStorage.removeItem(userData.id);
						$window.localStorage.removeItem(userData.authKey);

						$state.go('home');
						notification.success('You have logged out')
					};

					$scope.register = function register() {
						$scope.hashPassword();

						dataContext
							.users
							.save($scope.user)
							.$promise
							.then(function registerSuccess(res) {
								$scope.username = res.result.username;
								$window.localStorage.setItem(
									userData.name,
									res.result.username
								);
								notification.success('You are now registered')
							})
							.catch(error => notification.error(error));
					};
				}
			]
		);
}());