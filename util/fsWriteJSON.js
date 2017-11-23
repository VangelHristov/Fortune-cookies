'use strict';

const fs = require('fs');
const path = require('path');
const data = require('./test-data-json');

module.exports = function writeJSON() {
	let filePath = path.normalize(
		path.join(
			__dirname,
			'../data/test-data.json'
		)
	);

	fs.writeFileSync(filePath, JSON.stringify(data));
};

