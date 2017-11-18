(function userAuthFactoryModule() {
	'use strict';

	angular
		.module('app')
		.factory('userAuth', [
			'dataContext',
			'$window',
			'crypto',
			'storageKeys',
			function userAuth(
				dataContext,
				$window,
				crypto,
				storageKeys
			) {
				let hashPassword = function hashPassword(user) {
					user.passHash = crypto.encrypt(user.password);
					user.password = undefined;
					user.confirmPassword = undefined;

					return user;
				};

				let logIn = function logIn(user) {
					user = hashPassword(user);

					return dataContext
						.users
						.authenticate(user)
						.$promise
						.then(function loginSuccess(res) {
							$window
								.localStorage
								.setItem(
									storageKeys.username,
									res.result.username
								);
							$window
								.localStorage
								.setItem(
									storageKeys.authKey,
									res.result.authKey
								);

							return Promise.resolve(res.result.username);
						})
						.catch(error => Promise.reject(error));
				};

				let logOut = function logOut() {
					$window.localStorage.removeItem(storageKeys.username);
					$window.localStorage.removeItem(storageKeys.userid);
					$window.localStorage.removeItem(storageKeys.authKey);

					return Promise.resolve();
				};

				let isLoggedIn = function () {
					return $window
						.localStorage
						.getItem(storageKeys.authKey) !== null;
				};

				let register = function register(user) {
					user = hashPassword(user);

					return dataContext
						.users
						.save(user)
						.$promise
						.then(function registerSuccess(res) {
							$window
								.localStorage
								.setItem(
									storageKeys.username,
									res.result.username
								);

							return Promise.resolve();
						})
						.catch(error => Promise.reject(error));
				};

				return {
					logIn,
					logOut,
					register,
					isLoggedIn
				};
			}
		]);
}());