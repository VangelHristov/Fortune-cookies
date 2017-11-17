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
				'notification',
				function userController(
					$scope,
					$state,
					userAuth,
					notification
				) {
					let initUser = function () {
						return {
							name           : '',
							password       : '',
							confirmPassword: ''
						};
					};

					$scope.category = '';

					$scope.form = {};
					$scope.user = initUser();

					$scope.logIn = function ligIn() {
						userAuth
							.logIn($scope.user)
							.then(() => {
								$scope.user = initUser();
								$scope.form.login.$setPristine();

								notification.success(`Welcome back, ${$scope.displayName}`);

								//Without using timeout the notification
								// does not show up.
								setTimeout(function timeout() {
									$state.go('myCookie');
								}, 500);
							})
							.catch(err=>{
								$scope.user = initUser();
								$scope.form.login.$setPristine();
								notification.error(err);
							});
					};

					$scope.register = function register() {
						userAuth
							.register($scope.user)
							.then(() => {
								$scope.user = initUser();
								$scope.form.register.$setPristine();

								notification.success('You have registered');

								//Without using timeout the notification
								// does not show up.
								setTimeout(function interval() {
									$state.go('login');
								}, 300);
							})
							.catch(err => {
								$scope.user = initUser();
								$scope.form.register.$setPristine();
								notification.error(err);
							});
					};

					$scope.matchPasswords = function matchPasswords() {
						return $scope.user.password === $scope.user.confirmPassword;
					};

					$scope.logOut = userAuth.logOut;

					$scope.isLoggedIn = userAuth.isLoggedIn;

					$scope.displayName = userAuth.getUsername();

					$scope.passwordsMatch = $scope.matchPasswords();
				}
			]
		);
}());