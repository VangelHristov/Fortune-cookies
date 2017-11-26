'use strict';

let gulp = require('gulp'),
	browserSync = require('browser-sync'),
	nodemon = require('gulp-nodemon'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	rev = require('gulp-rev'),
	del = require('del'),
	ngannotate = require('gulp-ng-annotate'),
	pump = require('pump');

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

	return nodemon({script: 'app.js'})
		.on('start', function nodemonStart() {
			// to avoid nodemon being started multiple times
			// thanks @matthisk
			if (!started) {
				cb();
				started = true;
			}
		});
});

gulp.task('clean', function cleanDist() {
	return del(['dist']);
});

gulp.task('build', ['clean'], function build() {
	gulp.start('usemin', 'copyfonts', 'copyviews');
});
gulp.task('usemin', function minify() {
	pump([
			gulp.src('./public/index.html'),
			usemin({
				css: [minifycss(), rev()],
				js : [ngannotate(), uglify(), rev()]
			}),
			gulp.dest('./dist/')
		], (err) => {
			if(err){
			    console.log(err.toString());
			}
		}
	);
});

gulp.task('copyfonts', function copyfonts() {
	gulp.src(
		'./public/bower_components/bootstrap/dist/fonts/*.{ttf,woff,eof,svg}*')
	    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copyviews', function copyViews() {
	return gulp.src('./public/views/*.html')
	           .pipe(gulp.dest('./dist/views'));
});
