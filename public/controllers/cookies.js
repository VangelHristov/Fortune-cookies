(function cookiesControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller(
			'FortuneCookiesController',
			[
				'$scope',
				'$state',
				'$window',
				'dataContext',
				'notification',
				'userData',
				function fortuneCookiesController(
					$scope,
					$state,
					dataContext,
					notification
				) {
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
					}
				}
			]
		);
}());