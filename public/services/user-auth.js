(function userAuthFactoryModule() {
	'use strict';

	angular
		.module('app')
		.factory('userAuth', [
			'dataContext',
			'notification',
			'$window',
			'crypto',
			'storageKeys',
			function userAuth(
				dataContext,
				notification,
				$window,
				crypto,
				storageKeys
			) {
				let hashPassword = function hashPassword(user) {
					user.passHash = crypto.encrypt(user.password);
					user.password = undefined;
					return user;
				};

				let logIn = function logIn(user) {
					user = hashPassword(user);

					dataContext
						.users
						.save(user)
						.$promise
						.then(function loginSuccess(res) {
							notification.success(`Welcome ${res.result.username}`);

							$window.localStorage.setItem(
								storageKeys.username,
								res.result.username
							);
							$window.localStorage.setItem(
								storageKeys.authKey,
								res.result.authKey
							);

							return Promise.resolve();
						})
						.catch(error => notification.error(error));
				};

				let logOut = function logOut() {

					$window.localStorage.removeItem(storageKeys.username);
					$window.localStorage.removeItem(storageKeys.userid);
					$window.localStorage.removeItem(storageKeys.authKey);

					notification.success('You have logged out');
					return Promise.resolve();
				};

				let isLoggedIn = function () {
					return $window.localStorage.getItem(storageKeys.authKey) !== null;
				}

				let register = function register(user) {
					user = hashPassword(user);

					dataContext
						.users
						.save(user)
						.$promise
						.then(function registerSuccess(res) {
							$window.localStorage.setItem(
								storageKeys.username,
								res.result.username
							);

							notification.success('You are now registered');
							return Promise.resolve();
						})
						.catch(error => notification.error(error));
				};

				let getUsername = function () {
					return $window.localStorage.getItem(storageKeys.username);
				};

				return {
					logIn,
					logOut,
					register,
					getUsername,
					isLoggedIn
				};
			}
		]);
}());