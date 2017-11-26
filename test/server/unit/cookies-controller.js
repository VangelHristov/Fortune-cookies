'use strict';

const sinon = require('sinon');
const {describe, it, beforeEach, afterEach} = require('mocha');
const {assert} = require('chai');
const dailyCookieController = require('../../../controllers/daily-cookie-controller');
const cookiesController = require('../../../controllers/cookies-controller');

const dbCookiesStub = [
	{id: '1'},
	{id: '2'}
];
const newCookie = {
	text    : 'unit testing is fun',
	category: 'cool thoughts',
	img     : 'http://localhost:300'
};

const dbUserStub = {dailyCookie: {}, username: 'johnDoe'};

let dbStub, dbSaveSpy, dbValueStub, dbInsertSpy, requestStub, cookieCtrl,
	responseStub, jsonSpy, statusStub, dailyCookieCtrl;

describe('cookies-controllers', function cookiesControllers() {
	beforeEach(function beforeEach() {
		// db setup
		dbInsertSpy = sinon.spy();

		dbValueStub = sinon.stub();
		dbValueStub.returns(dbCookiesStub);

		dbStub = sinon.stub();
		dbStub
			.withArgs('cookies')
			.returns({value: dbValueStub, insert: dbInsertSpy});
		dbStub.throws();

		dbSaveSpy = sinon.spy();
		dbStub.save = dbSaveSpy;

		//request setup
		requestStub = {user: dbUserStub, body: {}};

		//response setup
		jsonSpy = sinon.spy();

		statusStub = sinon.stub();
		statusStub.returns({json: jsonSpy});

		responseStub = {status: statusStub, json: jsonSpy};

		// controllers
		dailyCookieCtrl = dailyCookieController(dbStub);
		cookieCtrl = cookiesController(dbStub);
	});

	afterEach(function afterEach() {
		dbStub.reset();
		dbValueStub.reset();
		statusStub.reset();
		dbSaveSpy.reset();
		dbInsertSpy.reset();
		jsonSpy.reset();

	});

	describe(
		'daily-cookie-controller.js',
		function dailyCookieControllerTests() {
			it(
				'get returns 200 and daily cookie',
				function getCookie() {
					dailyCookieCtrl.get(requestStub, responseStub);

					assert.isTrue(statusStub.calledWithExactly(200));
					assert.isTrue(jsonSpy.calledWithExactly({result: dbCookiesStub[0]}) ||
						jsonSpy.calledWithExactly({result: dbCookiesStub[1]}));

					assert.isTrue(dbSaveSpy.called);
				}
			);

			it(
				'get returns 401 when user is not authorized',
				function getUnAuthorized() {
					requestStub.user = undefined;

					dailyCookieCtrl.get(requestStub, responseStub);

					assert.isTrue(statusStub.calledWithExactly(401));
				}
			);
		}
	);

	describe('cookies-controller.js', function cookiesController() {
		it(
			'get returns 200 and all cookies in db',
			function getAllCookies() {
				cookieCtrl.get(requestStub, responseStub);

				assert.isTrue(statusStub.calledWithExactly(200));
				assert.isTrue(jsonSpy.calledWithExactly({result: dbCookiesStub}));
			}
		);

		it(
			'post returns 201 and newly created cookie',
			function postCookie() {
				requestStub.body = newCookie;

				cookieCtrl.post(requestStub, responseStub);

				assert.isTrue(statusStub.calledWithExactly(201));
				assert.isTrue(jsonSpy.called);

				let resResult = jsonSpy.args[0][0].result;
				assert.strictEqual(resResult.text, newCookie.text);
				assert.strictEqual(resResult.category, newCookie.category);
				assert.strictEqual(resResult.img, newCookie.img);
				assert.exists(resResult.id);
				assert.exists(resResult.shareDate);
			}
		);

		it(
			'post adds default image url if one is not provided',
			function postCookieWithoutImg() {
				newCookie.img = null;
				requestStub.body = newCookie;

				cookieCtrl.post(requestStub, responseStub);

				assert.isTrue(statusStub.calledWithExactly(201));
				assert.isTrue(jsonSpy.called);

				let resResult = jsonSpy.args[0][0].result;
				assert.exists(resResult.img);

				newCookie.img = 'http://localhost:300';
			}
		);

		it(
			'post returns 401 when user is not authenticated',
			function postUnAuthenticated() {
				requestStub.body = newCookie;
				requestStub.user = undefined;

				cookieCtrl.post(requestStub, responseStub);

				assert.isTrue(statusStub.calledWithExactly(401));
			}
		);
	});
});