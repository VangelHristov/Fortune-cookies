(function dataContextModule() {
	'use strict';

	angular
		.module('app')
		.factory(
			'dataContext',
			[
				'$resource',
				function dataContext($resource) {
					return {
						myCookie  : $resource('/api/my-cookie'),
						cookies   : $resource(
							'/api/cookies/:id',
							{id: '@id'},
							{rate: {method: 'PUT'}}
						),
						users     : $resource(
							'/api/users/:id',
							{id: '@id'},
							{authenticate: {method: 'PUT'}}
						),
						categories: $resource('/api/categories')
					};
				}
			]
		);
}());