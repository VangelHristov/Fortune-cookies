'use strict';

const sinon = require('sinon');
const {describe, it, afterEach, beforeEach} = require('mocha');
const {assert} = require('chai');

const {AUTH_HEADER, AUTH_KEY_CHARS} = require('../../../util/constants');
const VALID_AUTH_KEY = require('../../../util/generate-auth-key')('topSecret');

const authentication = require('../../../middlewares/authenticate');

const getInvalidAuthKey = function (type) {
	let short = function () {
		let len = VALID_AUTH_KEY.length - 2;
		return VALID_AUTH_KEY.slice(0, len);
	};

	let long = function () {
		let key = VALID_AUTH_KEY;
		key += AUTH_KEY_CHARS[0];
		return key;
	};

	let invalidChar = function () {
		let key = short();
		let s;
		for (let i = 32; i <= 126; i++) {
			s = String.fromCharCode(i);
			if (AUTH_KEY_CHARS.indexOf(s) === -1) {
				break;
			}
		}

		key += s;
		return key;
	};

	let getKey = {
		short,
		long,
		invalidChar
	};

	return getKey[type]();
};

let auth, nextSpy, responseStub, requestStub, statusStub,
	jsonSpy, dbFindStub, dbStub;

describe('authentication.js', function authenticationJS() {
	beforeEach(function beforeEach() {
		// db setup
		dbFindStub = sinon.stub();
		dbFindStub
			.withArgs({authKey: VALID_AUTH_KEY})
			.returns({
				authKey : VALID_AUTH_KEY,
				username: 'johnDoe'
			});
		dbFindStub
			.returns(null);

		dbStub = sinon.stub();
		dbStub
			.withArgs('users')
			.returns({find: dbFindStub});
		dbStub.throws();

		//request setup
		requestStub = {headers: {}, body: {}};

		//response setup
		jsonSpy = sinon.spy();

		statusStub = sinon.stub();
		statusStub.returns({json: jsonSpy});

		responseStub = {status: statusStub, json: jsonSpy};

		// next setup
		nextSpy = sinon.spy();

		auth = authentication(dbStub);
	});

	afterEach(function afterEach() {
		nextSpy.reset();
		statusStub.reset();
		jsonSpy.reset();
		dbFindStub.reset();
	});

	it(
		'add property `user` to request object when authKey is valid',
		function validCredentials() {
			requestStub.headers[AUTH_HEADER] = VALID_AUTH_KEY;

			auth(requestStub, responseStub, nextSpy);

			assert.isNotNull(requestStub.user);
			assert.isTrue(nextSpy.called);
		}
	);

	it(
		'return 401 when authKey is too short',
		function shortKey() {
			requestStub.headers[AUTH_HEADER] = getInvalidAuthKey('short');

			auth(requestStub, responseStub, nextSpy);

			assert.isTrue(statusStub.calledWith(401));
		}
	);

	it(
		'return 401 when authKey is too long',
		function longKey() {
			requestStub.headers[AUTH_HEADER] = getInvalidAuthKey('long');

			auth(requestStub, responseStub, nextSpy);

			assert.isTrue(statusStub.calledWith(401));
		}
	);

	it(
		'return 401 when authKey contain a char that is not allowed',
		function invalidChar() {
			requestStub
				.headers[AUTH_HEADER] = getInvalidAuthKey('invalidChar');

			auth(requestStub, responseStub, nextSpy);

			assert.isTrue(statusStub.calledWith(401));
		}
	);

	it('return 401 when authKey is missing', function missingKey() {
		requestStub.headers[AUTH_HEADER] = undefined;
		auth(requestStub, responseStub, nextSpy);

		assert.isTrue(statusStub.calledWith(401));
	});
});