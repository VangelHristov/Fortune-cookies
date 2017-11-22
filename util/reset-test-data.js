'use strict';

const fs = require('fs');
const path = require('path');
const dataDbPath = path.join(
	__dirname,
	path.normalize('../data/test-data.json')
);

module.exports = function resetTestDataModule(json, callback) {
	fs.writeFile(
		dataDbPath,
		JSON.stringify(json),
		(err) => err ? callback(err) : callback()
	);
};