(function userControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller(
			'UserController',
			[
				'$scope',
				'$state',
				'$timeout',
				'userAuth',
				'notification',
				'favorites',
				function userController(
					$scope,
					$state,
					$timeout,
					userAuth,
					notification,
					favorites
				) {
					let initUser = function () {
						return {
							name           : '',
							password       : '',
							confirmPassword: ''
						};
					};

					let stateGo = function (state) {
						//When calling both $state.go and notification
						//without timeout only one of them executes.
						$timeout($state.transitionTo, 200, true, state);
					};

					$scope.category = '';

					$scope.form = {};
					$scope.user = initUser();

					$scope.logIn = function ligIn() {
						userAuth
							.logIn($scope.user)
							.then((username) => {
								$scope.user = initUser();
								$scope.form.login.$setPristine();

								notification.success(`You are logged in as ${username}`);
								stateGo('myCookie');
							})
							.catch(err => {
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
								stateGo('login');
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

					$scope.logOut = function logOut() {
						userAuth
							.logOut()
							.then(() => {
								notification.success('You have logged out');
							})
							.catch(err => notification.error(err));
					};

					$scope.isLoggedIn = userAuth.isLoggedIn;

					$scope.passwordsMatch = $scope.matchPasswords();

					$scope.saveToFavorites = function save(cookieId) {
						favorites
							.save({cookieId:cookieId})
							.then(res => notification.success(res))
							.catch(err => notification.error(err));
					};
				}
			]
		);
}());