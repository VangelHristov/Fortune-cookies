'use strict';

const sinon = require('sinon');
const {describe, it, afterEach} = require('mocha');
const {assert} = require('chai');
const userController = require('../../../controllers/users-controller');

// Test users credentials
const existing_username = 'johnDoe';
const existing_passHash = 'topSecret';
const new_username = 'johnDoe2';
const new_passHash = 'topSecret2';
const existing_authKey = 'someKey';

let dbFindStub, dbInsertSpy, dbSaveSpy,
	dbStub, jsonSpy, statusStub,
	responseStub, requestStub, usrCtrl;

describe('users-controller.js', function usersController() {
	beforeEach(function beforeEach() {
		// db setup
		dbFindStub = sinon.stub();
		dbFindStub.withArgs({username: existing_username})
		          .returns({
			          username: existing_username,
			          passHash: existing_passHash,
			          authKey : existing_authKey
		          });
		dbFindStub.returns(null);

		dbInsertSpy = sinon.spy();

		dbSaveSpy = sinon.spy();

		dbStub = sinon.stub();
		dbStub.withArgs('users')
		      .returns({
			      find  : dbFindStub,
			      save  : dbSaveSpy,
			      insert: dbInsertSpy
		      });
		dbStub.throws(Error('controller should query users collection'));

		// request setup
		requestStub = {
			body: {
				username: new_username,
				passHash: new_passHash
			}
		};

		// response setup
		jsonSpy = sinon.spy();

		statusStub = sinon.stub();
		statusStub.returns({json: jsonSpy});

		responseStub = {status: statusStub};

		// controller to test
		usrCtrl = userController(dbStub);
	});

	afterEach(function afterEach() {
		dbStub.reset();
		dbFindStub.reset();
		statusStub.reset();
		dbSaveSpy.reset();
		dbInsertSpy.reset();
		jsonSpy.reset();
	});

	it(
		'post validates the username is unique',
		function postUnique() {
			usrCtrl.post(requestStub, responseStub);

			assert.isTrue(dbFindStub.calledWith({username: new_username}));
		}
	);

	it(
		'post returns 201 and username',
		function postUnique() {
			usrCtrl.post(requestStub, responseStub);

			assert.isTrue(responseStub.status.calledWith(201));
			assert.isTrue(jsonSpy.calledWith({result: new_username}));
		}
	);

	it(
		'post adds in db new user containing all required properties',
		function postUnique() {
			usrCtrl.post(requestStub, responseStub);

			let user = dbInsertSpy.args[0][0];

			assert.isString(user.username);
			assert.isString(user.passHash);
			assert.isObject(user.dailyCookie);
			assert.isArray(user.favorites);
		}
	);

	it(
		'post returns 400 when username not unique',
		function postNotUnique() {
			requestStub.body.username = existing_username;
			requestStub.body.passHash = existing_passHash;

			usrCtrl.post(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(400));
		}
	);

	it(
		'put returns 200 and result containing username and authKey',
		function putExisting() {
			requestStub.body.username = existing_username;
			requestStub.body.passHash = existing_passHash;

			usrCtrl.put(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(200));

			let res = jsonSpy.args[0][0];

			assert.isObject(res.result);
			assert.isString(res.result.username);
			assert.isString(res.result.authKey);
		}
	);

	it(
		'put returns 404 when username not in db',
		function putUnique() {
			requestStub.body.username = new_username;
			requestStub.body.passHash = new_passHash;

			usrCtrl.put(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(404));
		}
	);

	it(
		'put returns 404 when passHashes don\'t match',
		function putUnique() {
			requestStub.body.username = existing_username;
			requestStub.body.passHash = new_passHash;

			usrCtrl.put(requestStub, responseStub);

			assert.isTrue(statusStub.calledWith(404));
		}
	);
});
