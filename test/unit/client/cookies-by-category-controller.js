'use strict';

const JSDOM = require('jsdom').JSDOM;
const dom = new JSDOM(`
<!doctype html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<script src = "./public/bower_components/jquery/dist/jquery.js"></script>
<script src = "./public/bower_components/bootstrap/dist/js/bootstrap.js"></script>
<script src = "./public/bower_components/toastr/toastr.js"></script>
<script src = "./public/bower_components/crypto-js/crypto-js.js"></script>
<script src = "./public/bower_components/angular/angular.js"></script>
<script src = "./public/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<script src = "./public/bower_components/angular-resource/angular-resource.js"></script>
<script src = "./public/bower_components/angular-mocks/angular-mocks.js"></script>

<script src = "./public/app.js"></script>
<script src = "./public/app.config.js"></script>

<script src = "./public/constants/storage-keys.js"></script>

<script src = "./public/services/crypto.js"></script>
<script src = "./public/services/data-context.js"></script>
<script src = "./public/services/notification.js"></script>
<script src = "./public/services/request-interceptor.js"></script>
<script src = "./public/services/fortune-cookies-service.js"></script>
<script src = "./public/services/user-auth.js"></script>
<script src = "./public/services/favorites-service.js"></script>

<script src = "./public/controllers/user-controller.js"></script>
<script src = "./public/controllers/share-cookie-controller.js"></script>
<script src = "./public/controllers/home-controller.js"></script>
<script src = "./public/controllers/my-cookie-controller.js"></script>
<script src = "./public/controllers/favorites-controller.js"></script>
<script src = "./public/controllers/cookies-by-category-controller.js"></script>
</body>
</html>`);

const mocha = require('mocha');

global.window = dom.window;

global.window.mocha = mocha;
global.window.beforeEach = mocha.beforeEach;
global.window.afterEach = mocha.afterEach;
global.document = dom.window.document;
global.sinon = require('sinon');
global.assert = require('chai').assert;

global.describe = mocha.describe;
global.it = mocha.it;
global.before = mocha.before;
global.after = mocha.after;
global.beforeEach = mocha.beforeEach;
global.afterEach = mocha.afterEach;

global.angular = dom.window.angular;
global.inject = global.angular.mock.inject;
global.module = global.angular.mock.module;
let cookies = [
	{text: 'cookie 1'},
	{text: 'cookie 2'},
	{text: 'cookie 3'}
];
let scope, $controller, fortuneCookiesStub, stateParams;

describe('cookies-by-category-controller.js', function testSuite() {
	beforeEach(() => global.module('app'));

	beforeEach(function setup() {
		scope = {$parent: {}};

		stateParams = {category: 'testing'};

		fortuneCookiesStub = global.sinon.stub();
		fortuneCookiesStub
			.withArgs('testing')
			.returns(cookies);

		global.module({'fortuneCookies': fortuneCookiesStub});

		inject(function injectController(_$controller_) {
			$controller = _$controller_;
		});
	});

	it(
		'$scope.cookies and $scope.category are initialized correctly',
		function initCookiesAndCategory() {
			let ctrl = $controller(
				'CookiesByCategoryController',
				{
					$scope        : scope,
					fortuneCookies: fortuneCookiesStub,
					$stateParams  : stateParams
				}
			);

			global.assert.equal(ctrl.$scope.cookies, cookies);
		}
	);
});