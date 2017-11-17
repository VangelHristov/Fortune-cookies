(function shareCookiesControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('ShareCookieController', [
			'$scope',
			'fortuneCookies',
			'$state',
			'notification',
			function ShareCookieController(
				$scope,
				fortuneCookies,
				$state,
				notification
			) {
				$scope.cookie = {
					text    : '',
					category: '',
					img     : ''
				};

				$scope.url = new RegExp([
					'^((https?:\\/\\/)|(www.))',
					'[a-zA-Z0-9][a-zA-Z0-9\\-\\.]{2,}',
					'[a-zA-Z0-9].[a-zA-Z]{2,6}',
					'(\\/\\S*)?$'
				].join(''), 'gi');

				$scope.share = function share() {
					fortuneCookies
						.share($scope.cookie)
						.then(() => {
							notification.success('You shared a cookie');
							setTimeout(() => $state.go('home'), 300);
						})
						.catch(err => notification.error(err));
				};
			}
		]);
}());