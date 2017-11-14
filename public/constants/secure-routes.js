(function secureRoutesModule() {
	'use strict';

	angular
		.module('app')
		.constant('secureRoutes', [
			'my-fortune-cookie',
			'share-new-fortune-cookie'
		]);
}());