'use strict';

const sinon = require('sinon');
const {assert} = require('chai');
const {describe, it, beforeEach, afterEach} = require('mocha');
const favoritesController = require('../controllers/favorites-controller');

const testCookie1 =
	{
		id       : '1',
		img      : 'http://localhost:300',
		text     : 'test cookie 1',
		category : 'testing',
		shareDate: new Date().toISOString()
	};
const testCookie2 =
	{
		id       : '2',
		img      : 'http://localhost:300',
		text     : 'test cookie 2',
		category : 'testing',
		shareDate: new Date().toISOString()
	};
const testCookie3 =
	{
		id       : '3',
		img      : 'http://localhost:300',
		text     : 'test cookie 1',
		category : 'testing',
		shareDate: new Date().toISOString()
	};
const dailyCookie = testCookie3;
dailyCookie.day = 1;

const dbUserUsername = 'johnDoe';
const dbPassHash = 'topSecret';
const dbAuthKey = 'someAuthKey';
const dbUserStub = {
	username   : dbUserUsername,
	passHash   : dbPassHash,
	authKey    : dbAuthKey,
	favorites  : [testCookie1, testCookie2],
	dailyCookie: dailyCookie
};

let dbStub, dbFindStub, dbSaveSpy, requestStub, responseStub, jsonSpy,
	statusStub, controller;

describe('favorites-controller.js', function favCtrl() {
	beforeEach(function beforeEach() {
		// db setup
		dbFindStub = sinon.stub();
		dbFindStub
			.withArgs({username: dbUserUsername})
			.returns(dbUserStub);
		dbFindStub
			.withArgs({id: '3'})
			.returns(testCookie3);
		dbFindStub
			.returns(null);

		dbSaveSpy = sinon.spy();

		dbStub = sinon.stub();
		dbStub
			.withArgs('users')
			.returns({find: dbFindStub});
		dbStub
			.withArgs('cookies')
			.returns({find: dbFindStub});
		dbStub
			.throws(
				Error('controller should query only users or' +
					' cookies collections')
			);
		dbStub.save = dbSaveSpy;

		// request setup
		requestStub = {
			body  : {},
			params: {},
			user  : {username: dbUserUsername}
		};

		// response setup
		jsonSpy = sinon.spy();
		statusStub = sinon.stub();
		statusStub.returns({json: jsonSpy});
		responseStub = {status: statusStub};

		controller = favoritesController(dbStub);
	});

	afterEach(function afterEach() {
		dbStub.reset();
		dbSaveSpy.reset();
		dbFindStub.reset();
		jsonSpy.reset();
		statusStub.reset();
	});

	it(
		'get returns 200 and user\'s favorites',
		function getFavorites() {
			controller.get(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(200));
			assert.isTrue(
				jsonSpy
					.calledWith({result: dbUserStub.favorites})
			);
		}
	);

	it(
		'get returns 401 when user is not authenticated',
		function getUnauthenticated() {
			requestStub.user = {};

			controller.get(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(401));
		}
	);

	it(
		'del returns 401 when user is not authenticated',
		function getUnauthenticated() {
			requestStub.user = {};

			controller.del(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(401));
		}
	);

	it(
		'post returns 401 when user is not authenticated',
		function getUnauthenticated() {
			requestStub.user = {};

			controller.post(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(401));
		}
	);

	it(
		'post returns 200 and saves the cookie in the user favorites',
		function postCookie() {
			requestStub.params.cookieId = testCookie3.id;

			controller.post(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(200));
			assert.include(dbUserStub.favorites, testCookie3);
			assert.isTrue(dbSaveSpy.called);

			dbUserStub.favorites.pop();
		}
	);

	it(
		'post returns 400 when cookieId does not exist in db',
		function postWrongId() {
			requestStub.params.cookieId = testCookie1.id;

			controller.post(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(400));
		}
	);

	it(
		'post returns 400 when cookie already in favorites',
		function postExisting() {
			dbUserStub.favorites.push(testCookie3);
			requestStub.params.cookieId = testCookie3.id;

			controller.post(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(400));

			dbUserStub.favorites.pop();
		}
	);

	it(
		'del returns 400 when cookie not in user\'s favorites',
		function getUnauthenticated() {
			requestStub.params.cookieId = testCookie3.id;

			controller.del(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(400));
		}
	);

	it(
		'del returns 200 and removes cookie from user\'s favorites',
		function getUnauthenticated() {
			let cookieToDelete = dbUserStub.favorites[0];
			requestStub.params.cookieId = cookieToDelete.id;

			controller.del(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(200));
			assert.notInclude(dbUserStub.favorites, cookieToDelete);

			dbUserStub.favorites.push(cookieToDelete);
		}
	);
});