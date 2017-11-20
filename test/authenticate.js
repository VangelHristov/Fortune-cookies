/* eslint-disable no-unused-expressions */
'use strict';

const authentication = require('../middlewares/authenticate');
const sinon = require('sinon');
const {describe, it, afterEach} = require('mocha');
const {assert} = require('chai');
const {
	AUTH_HEADER,
	AUTH_KEY_CHARS,
	AUTH_KEY_LENGTH
} = require('../util/constants');

const getValidAuthKey = function () {
	let key = '';
	let len = AUTH_KEY_LENGTH;

	while (key.length < len) {
		key += AUTH_KEY_CHARS[Math.floor(Math.random() * len)];
	}

	return key;
};

const getInvalidAuthKey = function (type) {
	let short = function () {
		let key = getValidAuthKey();
		key = key.substr(0, key.length - 2);
		return key;
	};

	let long = function () {
		let key = getValidAuthKey();
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

const VALID_AUTH_KEY = getValidAuthKey();

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

const requestMock = {headers: {}},
	responseMock = {status: ()=>undefined},
	nextMock = ()=>undefined;

let responseSpy = sinon.spy(responseMock, 'status');

let testSubject = authentication(dbMock);

describe('authentication.js', function authenticationJS() {
	afterEach(function afterEach() {
		responseSpy.reset();
	});

	it(
		'add property `user` to request object when credentials are valid',
		function validCredentials() {
			requestMock.headers[AUTH_HEADER] = VALID_AUTH_KEY;
			testSubject(requestMock, responseMock, nextMock);
			assert.isNotNull(requestMock.user);
		}
	);

	it(
		'return status code 401 when authKey is too short',
		function shortKey() {
			requestMock.headers[AUTH_HEADER] = getInvalidAuthKey('short');
			testSubject(requestMock, responseMock, nextMock);
			assert.isTrue(responseSpy.calledWith(401));
		}
	);

	it(
		'return status code 401 when authKey is too long',
		function longKey() {
			requestMock.headers[AUTH_HEADER] = getInvalidAuthKey('long');
			testSubject(requestMock, responseMock, nextMock);
			assert.isTrue(responseSpy.calledWith(401));
		}
	);

	it(
		'return status code 401 when authKey contain a char that is not' +
		' allowed',
		function invalidChar() {
			requestMock.headers[AUTH_HEADER] = getInvalidAuthKey('invalidChar');
			testSubject(requestMock, responseMock, nextMock);
			assert.isTrue(responseSpy.calledWith(401));
		}
	);

	it('return status code 401 when authKey is missing', function missingKey() {
		requestMock.headers[AUTH_HEADER] = undefined;
		testSubject(requestMock, responseMock, nextMock);
		assert.isTrue(responseSpy.calledWith(401));
	});
});