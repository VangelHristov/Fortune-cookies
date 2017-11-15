(function cookiesControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller(
			'FortuneCookiesController',
			[
				'$scope',
				'$state',
				'dataContext',
				'notification',
				'cookies',
				function fortuneCookiesController(
					$scope,
					$state,
					dataContext,
					notification,
					cookies
				) {
					$scope.cookies = cookies;
					console.log($scope.cookies);
					$scope.sortBy = 'date';
					$scope.fortuneCookie = {
						text    : '',
						category: '',
						url     : ''
					};

					$scope.share = function share() {
						dataContext
							.cookies
							.save($scope.fortuneCookie)
							.$promise
							.then(function shareSuccess() {
								$state.go('home');
								notification.success(
									'You shared a fortune cookie');
							})
							.catch(error => notification.error(error));
					};

					$scope.rate = function rate(fortuneCookie) {
						//fortuneCookie is object with following properties:
						// id: fortuneCookie id
						// type: like or dislike

						dataContext
							.cookies
							.rate(
								{id: fortuneCookie.id},
								fortuneCookie
							)
							.$promise
							.then(function rateSuccess() {
								notification
									.success('Your rating was submitted')
							})
							.catch(error => notification.error(error));
					};
				}
			]
		);
}());