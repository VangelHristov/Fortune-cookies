'use strict';

const supertest = require('supertest');
const request = supertest(require('../../app'));

const {describe, it, before, after} = require('mocha');
const {assert} = require('chai');

const testDbSeed = require('../../util/test-data-seed');
const dbUser = testDbSeed.users[0];

const resetTestData = require('../../util/reset-test-data');

const crypto = require('crypto');
const {
	USERNAME_MIN_LENGTH,
	USERNAME_MAX_LENGTH,
	USERNAME_CHARS
} = require('../../util/constants');

const getUniqueName = (function getUniqueNameIIFE() {
	const floor = Math.floor;
	const random = Math.random;
	const existing = [];
	testDbSeed.users.forEach(u => existing.push(u.username));

	const genName = function () {
		let name = '';
		let index;
		while (name.length < USERNAME_MAX_LENGTH) {
			index = floor(random() * USERNAME_MAX_LENGTH);
			name += USERNAME_CHARS[index];
		}

		return name;
	};

	return function getUnique() {
		let name = genName();
		if (existing.indexOf(name) === -1) {
			existing.push(name);
			return name;
		}

		return getUnique();
	};
}());

const getUniqueHash = (function getUniqueHashIIFE() {
	const existing = [];
	testDbSeed.users.forEach(u => existing.push(u.passHash));

	return function getUnique() {
		let hash = USERNAME_CHARS;
		do {
			hash = crypto
				.createHmac('md5', hash)
				.digest('hex');
		} while (existing.indexOf(hash) > -1);

		existing.push(hash);
		return hash;
	};
}());

describe('/api/users', function apiUsers() {
	before(function before(done) {
		// Restore the test database to its original state
		resetTestData(testDbSeed, done);
	});

	after(function after(done) {
		// Restore the test database to its original state
		resetTestData(testDbSeed, done);
	});

	it(
		'POST returns 201 when username and passHash are provided and' +
		' valid',
		function postValid(done) {
			request
				.post('/api/users')
				.send({
					username: getUniqueName(),
					passHash: getUniqueHash()
				})
				.set('Content-Tye', 'application/json')
				.set('Accepts', 'json')
				.expect(201, done);
		}
	);

	it(
		'POST returns username on success',
		function postSuccess(done) {
			let name = getUniqueName();

			request
				.post('/api/users')
				.send({
					username: name,
					passHash: getUniqueHash()
				})
				.set('Content-Tye', 'application/json')
				.set('Accepts', 'json')
				.expect(201, {result: name}, done);
		}
	);

	it(
		'POST returns 400 if username already exists',
		function postExistingUsername(done) {
			request
				.post('/api/users')
				.send({
					username: dbUser.username,
					passHash: dbUser.passHash
				})
				.set('Content-Tye', 'application/json')
				.set('Accepts', 'json')
				.expect(400, done);
		}
	);

	it(
		'POST returns 400 if no data is sent in the request body',
		function postRequestWithoutBody(done) {
			request
				.post('/api/users')
				.send({})
				.set('Content-Tye', 'application/json')
				.set('Accepts', 'json')
				.expect(400, done);
		}
	);

	it(
		'POST returns 400 if no username in the request body',
		function postRequestWithoutUsername(done) {
			request
				.post('/api/users')
				.send({passHash: getUniqueHash()})
				.set('Content-Tye', 'application/json')
				.set('Accepts', 'json')
				.expect(400, done);
		}
	);

	it(
		'POST returns 400 if no passHash in the request body',
		function postRequestWithoutPassHash(done) {
			request
				.post('/api/users')
				.send({username: getUniqueName()})
				.set('Content-Tye', 'application/json')
				.set('Accepts', 'json')
				.expect(400, done);
		}
	);

	it(
		'POST returns 400 if no username too short',
		function postRequestWithShortUsername(done) {
			let name = 'john';
			assert.isTrue(name.length < USERNAME_MIN_LENGTH);

			request
				.post('/api/users')
				.send({
					username: name,
					passHash: getUniqueHash()
				})
				.set('Content-Tye', 'application/json')
				.set('Accepts', 'json')
				.expect(400, done);
		}
	);

	it(
		'PUT returns 200 and authKey when username and passHash are valid',
		function putValidUser(done) {
			request
				.put('/api/users')
				.send({
					username: dbUser.username,
					passHash: dbUser.passHash
				})
				.expect(200)
				.end(function put(err, res) {
					assert.notExists(err);
					assert.isString(res.body.result.authKey);
					done();
				});
		}
	);

	it(
		'PUT returns 404 when passHash invalid',
		function putInvalidPassword(done) {
			let hash = getUniqueHash();

			assert.notStrictEqual(hash, dbUser.passHash);

			request
				.put('/api/users')
				.send({
					username: dbUser.username,
					passHash: hash
				})
				.expect(404, done);
		}
	);

	it(
		'PUT returns 404 when username not in db',
		function putInvalidPassword(done) {
			let hash = dbUser.passHash;
			let name = getUniqueName();

			assert.notStrictEqual(name, dbUser.username);

			request
				.put('/api/users')
				.send({
					username: name,
					passHash: hash
				})
				.expect(404, done);
		}
	);
});