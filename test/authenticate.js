'use strict';

const sinon = require('sinon');
const {describe, it, afterEach, after} = require('mocha');
const {assert} = require('chai');
const {AUTH_HEADER, AUTH_KEY_CHARS} = require('../util/constants');
const VALID_AUTH_KEY = require('../util/generate-auth-key')('topSecret');
const authentication = require('../middlewares/authenticate');

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

const dbMock = function () {
	return {
		find: function (obj) {
			if (obj.authKey === VALID_AUTH_KEY) {
				return obj;
			}

			return null;
		}
	};
};
const requestMock = {headers: {}};
const responseMock = {status: () => undefined};

let responseSpy = sinon.spy(responseMock, 'status');
let nextSpy = sinon.spy();

let auth = authentication(dbMock);

describe('authentication.js', function authenticationJS() {
	afterEach(function afterEach() {
		responseSpy.reset();
		nextSpy.reset();
	});

	after(function after() {
		responseSpy.restore();
	});

	it(
		'add property `user` to request object when authKey is valid',
		function validCredentials() {
			requestMock.headers[AUTH_HEADER] = VALID_AUTH_KEY;

			auth(requestMock, responseMock, nextSpy);

			assert.isNotNull(requestMock.user);
			assert.isTrue(nextSpy.calledWithExactly());
		}
	);

	it(
		'return 401 when authKey is too short',
		function shortKey() {
			requestMock.headers[AUTH_HEADER] = getInvalidAuthKey('short');

			auth(requestMock, responseMock, nextSpy);

			assert.isTrue(responseSpy.calledWith(401));
		}
	);

	it(
		'return 401 when authKey is too long',
		function longKey() {
			requestMock.headers[AUTH_HEADER] = getInvalidAuthKey('long');

			auth(requestMock, responseMock, nextSpy);

			assert.isTrue(responseSpy.calledWith(401));
		}
	);

	it(
		'return 401 when authKey contain a char that is not allowed',
		function invalidChar() {
			requestMock.headers[AUTH_HEADER] = getInvalidAuthKey('invalidChar');

			auth(requestMock, responseMock, nextSpy);

			assert.isTrue(responseSpy.calledWith(401));
		}
	);

	it(
		'return 401 when authKey is missing',
		function missingKey() {
			requestMock.headers[AUTH_HEADER] = undefined;

			auth(requestMock, responseMock, nextSpy);

			assert.isTrue(responseSpy.calledWith(401));
		}
	);
});