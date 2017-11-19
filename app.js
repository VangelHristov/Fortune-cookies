'use strict';

let express = require('express'),
	bodyParser = require('body-parser'),
	lowdb = require('lowdb');

let db = lowdb('./data/data.json');
db._.mixin(require('underscore-db'));

let app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', require('./util/authenticate')(db));

//User routes
let usersController = require('./controllers/users-controller')(db);
app.post('/api/users', usersController.post);
app.put('/api/users', usersController.put);

// Fortune cookies
let cookiesController = require('./controllers/cookies-controller')(db);
app.get('/api/cookies', cookiesController.get);
app.post('/api/cookies', cookiesController.post);

// My daily fortune cookies
let dailyCookie = require('./controllers/daily-cookie-controller')(db);
app.get('/api/my-cookie', dailyCookie.get);

// Categories
let favoritesController = require('./controllers/favorites-controller')(db);
app.get('/api/favorites', favoritesController.get);
app.post('/api/favorites/:cookieId', favoritesController.post);
app.delete('/api/favorites/:cookieId', favoritesController.del);

app.use(function errorHandler(err, req, res, next) {
	if (err) {
		return next('ERROR');
	}

	return next();
});

let port = 3000;
app.listen(port, function listen() {
	//eslint-disable-next-line no-console
	console.log('Server is running at http://localhost:' + port);
});