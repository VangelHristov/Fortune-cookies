'use strict';

let express = require('express'),
	bodyParser = require('body-parser'),
	lowdb = require('lowdb'),
	helmet = require('helmet');

let db;

if (process.env.NODE_ENV === 'development') {
	const writeJSON = require('./util/fsWriteJSON');

	writeJSON();

	db = lowdb('./data/test-data.json');
	db._.mixin(require('underscore-db'));
} else {
	db = lowdb('./data/data.json');
	db._.mixin(require('underscore-db'));
}

let app = express();
app.use(helmet(require('./util/helmet-settings')));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
	app.use(express.static('public'));
} else {
	app.use(express.static('dist'));
}

//Validation middleware
let {
	validateCookieId,
	validateUser,
	validateCookie
} = require('./middlewares/validator');
let checkValidationResult = require('./middlewares/check-validation-result');

//Authentication middleware
let authenticate = require('./middlewares/authenticate')(db);

//User routes
let usersController = require('./controllers/users-controller')(db);
app.all('/api/users', [validateUser, checkValidationResult]);
app.post('/api/users', usersController.post);
app.put('/api/users', usersController.put);

// Fortune cookies
let cookiesController = require('./controllers/cookies-controller')(db);
app.get('/api/cookies', cookiesController.get);
app.post(
	'/api/cookies',
	[authenticate, validateCookie, checkValidationResult],
	cookiesController.post
);

// My daily fortune cookies
let dailyCookie = require('./controllers/daily-cookie-controller')(db);
app.get('/api/my-cookie', authenticate, dailyCookie.get);

// Favorites
let favoritesController = require('./controllers/favorites-controller')(db);
app.get('/api/favorites', authenticate, favoritesController.get);
app.post(
	'/api/favorites/:cookieId',
	[authenticate, validateCookieId, checkValidationResult],
	favoritesController.post
);
app.delete(
	'/api/favorites/:cookieId',
	[authenticate, validateCookieId, checkValidationResult],
	favoritesController.del
);

let port = process.env.PORT || 3000;

// This check is needed for integration tests
if (!module.parent) {

	app.listen(port, function listen() {
		//eslint-disable-next-line no-console
		console.log('Server is running at http://localhost:' + port);
	});
}

//For testing
module.exports = app;