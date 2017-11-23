'use strict';

const supertest = require('supertest');
const request = supertest(require('../../app'));

const testDbSeed = require('../../util/test-data-json');
const dbUser = testDbSeed.users[0];

const {assert} = require('chai');
const {describe, it} = require('mocha');

const {AUTH_HEADER} = require('../../util/constants');

describe('/api/cookies', function apiCookiesTests() {
	it(
		'GET returns 200 and all cookies',
		function getAll(done) {
			request
				.get('/api/cookies')
				.set('Accepts', 'json')
				.expect(200)
				.end(function assertions(err, res) {
					let resultCookiesCount = res
						.body
						.result
						.length;
					let initialCookiesCount = testDbSeed
						.cookies
						.length;

					assert.isAtLeast(resultCookiesCount, initialCookiesCount);
					assert.notExists(err);

					done();
				});
		}
	);

	it(
		'POST return 201 and new cookie with all required properties',
		function postCookie(done) {
			let cookie = {
				text    : 'I am a new cookie',
				category: 'testing'
			};

			request
				.post('/api/cookies')
				.set(AUTH_HEADER, dbUser.authKey)
				.set('Content-Type', 'application/json')
				.set('Accepts', 'json')
				.send(cookie)
				.expect(201)
				.end(function postResult(err, res) {
					let result = res.body.result;

					assert.notExists(err);
					assert.strictEqual(result.text, cookie.text);
					assert.strictEqual(result.category, cookie.category);
					assert.isString(result.img);
					assert.isString(result.shareDate);
					assert.isString(result.id);

					done();
				})
		}
	);

	it(
		'POST returns 401 when user not authenticated',
		function postUnAuthenticated(done) {
			request
				.post('/api/cookies')
				.send({
					text    : 'I am a new cookie',
					category: 'testing'
				})
				.set('Accepts', 'json')
				.set('Content-Type', 'application/json')
				.set(AUTH_HEADER, 'someInvalidKey')
				.expect(401, done);
		}
	);

	it(
		'POST returns 400 when cookie has no text',
		function postCookieWithoutText(done) {
			request
				.post('/api/cookies')
				.set('Accepts', 'json')
				.set('Content-Type', 'application/json')
				.set(AUTH_HEADER, dbUser.authKey)
				.send({category: 'testing'})
				.expect(400, done);
		}
	);

	it(
		'POST returns 400 when cookie has no category',
		function postCookieWithoutCategory(done) {
			request
				.post('/api/cookies')
				.set('Accepts', 'json')
				.set('Content-Type', 'application/json')
				.set(AUTH_HEADER, dbUser.authKey)
				.send({text: 'lorem ipsum'})
				.expect(400, done);
		}
	);

	it(
		'POST returns 201 and cookie with html encoded text and category',
		function postCookieWithHtmlTags(done) {
			request
				.post('/api/cookies')
				.set('Accepts', 'json')
				.set('Content-Type', 'application/json')
				.set(AUTH_HEADER, dbUser.authKey)
				.send({
					text    : '<script>alert("you have been hacked")</script>',
					category: '<br>hack'
				})
				.expect(201)
				.end(function assertions(err, res) {
					let resResult = res.body.result;
					let encodedText = '&lt;script&gt;alert(&quot;you have' +
						' been hacked&quot;)&lt;&#x2F;script&gt;';

					assert.equal(resResult.text, encodedText);
					assert.equal(resResult.category, '&lt;br&gt;hack');
					assert.notExists(err);

					done();
				});
		}
	);

	it(
		'POST returns 201 and cookie without extra properties',
		function postEvilCookie(done) {
			request
				.post('/api/cookies')
				.send({
					text    : 'I am a new cookie',
					category: 'testing',
					hack    : '<script>alert("you have been hacked")</script>'
				})
				.set('Accepts', 'json')
				.set('Content-Type', 'application/json')
				.set(AUTH_HEADER, dbUser.authKey)
				.expect(201)
				.end(function assertions(err, res) {
					let resResult = res.body.result;

					assert.notExists(err);
					assert.notExists(resResult.hack);

					done();
				});
		}
	);
});