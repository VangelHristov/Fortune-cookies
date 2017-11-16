'use strict';

let gulp = require('gulp');
let browserSync = require('browser-sync');
let nodemon = require('gulp-nodemon');

gulp.task('default', ['browser-sync'], function defaultTask() {
});

gulp.task('browser-sync', ['nodemon'], function browserSyncTask() {
	browserSync.init(null, {
		proxy  : "http://localhost:3000",
		files  : ["public/**/*.*"],
		browser: "firefox",
		port   : 3001,
	});
});
gulp.task('nodemon', function nodemonTask(cb) {

	let started = false;

	return nodemon({
		script: 'app.js'
	})
		.on('start', function nodemonStart() {
			// to avoid nodemon being started multiple times
			// thanks @matthisk
			if (!started) {
				cb();
				started = true;
			}
		});
});