'use strict';

const testDbSeed = require('../../util/test-data-seed');
const dbUser = testDbSeed.users[0];

const {assert} = require('chai');
const {describe, it} = require('mocha');

const {AUTH_HEADER} = require('../../util/constants');

const supertest = require('supertest');
const request = supertest(require('../../app'));

describe('/api/my-cookie', function myCookieTestSuit() {
	it(
		'GET returns user\'s daily fortune cookie',
		function getDailyCookie(done) {
			request
				.get('/api/my-cookie')
				.set('Accepts', 'json')
				.set(AUTH_HEADER, dbUser.authKey)
				.expect(200)
				.end(function assertions(err, res) {
					assert.notExists(err);

					let resResult = res.body.result;
					assert.hasAllKeys(
						resResult,
						['text', 'category', 'shareDate', 'img', 'id', 'day']
					);

					done();
				})
		}
	);

	it(
		'GET returns 401 when user is not authenticated',
		function getUnauthenticated(done) {
			request
				.get('/api/my-cookie')
				.set('Accepts', 'json')
				.expect(401, done);
		}
	);
});

describe('/api/favorites', function apiFavoritesTests() {
	let favoriteCookieId = dbUser.favorites[0].id;

	it(
		'GET returns user favorite cookies when authenticated',
		function getFavorites(done) {
			request
				.get('/api/favorites')
				.set(AUTH_HEADER, dbUser.authKey)
				.expect(200, done);
		}
	);

	it(
		'GET returns 401 when user is not authenticated',
		function getUnauthenticated(done) {
			request
				.get('/api/favorites')
				.set('Accepts', 'json')
				.expect(401, done);
		}
	);

	it(
		'DELETE returns 401 when user is not authenticated',
		function delUnauthenticated(done) {
			request
				.delete('/api/favorites/' + favoriteCookieId)
				.set('Accepts', 'json')
				.expect(401, done);
		}
	);

	it(
		'DELETE returns 200 when cookie in favorites',
		function delCookie(done) {
			request
				.get('/api/cookies')
				.set('Accepts', 'json')
				.expect(200)
				.end(function delExisting(err, res) {
					assert.notExists(err);

					let existingId = res.body.result[0].id;
					request
						.post('/api/favorites/' + existingId)
						.set(AUTH_HEADER, dbUser.authKey)
						.set('Accepts', 'json')
						.expect(200)
						.end(function deleteExisting(err) {
							assert.notExists(err);

							request
								.delete('/api/favorites/' + existingId)
								.set(AUTH_HEADER, dbUser.authKey)
								.set('Accepts', 'json')
								.expect(200, done);
						});
				});
		}
	);
});