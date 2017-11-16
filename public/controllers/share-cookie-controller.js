(function shareCookiesControllerModule() {
	'use strict';

	angular
		.module('app')
		.controller('ShareCookieController', [
			'$scope',
			'fortuneCookies',
			'$state',
			function ShareCookieController($scope, fortuneCookies, $state) {
				$scope.cookie = {
					text    : '',
					category: '',
					url     : ''
				};
				$scope.text = /.{6,230}/;
				$scope.url = new RegExp([
					'^((https?:\\/\\/)|(www.))',
					'[a-zA-Z0-9][a-zA-Z0-9\\-\\.]{2,}',
					'[a-zA-Z0-9].[a-zA-Z]{2,6}',
					'(\\/\\S*)?$'
				].join(''), 'gi');

				$scope.share = function share() {
					fortuneCookies
						.share($scope.fortuneCookie)
						.then($state.go('home'))
				};
			}
		]);
}());