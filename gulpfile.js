'use strict';

let gulp = require('gulp'),
	browserSync = require('browser-sync'),
	nodemon = require('gulp-nodemon'),
	cleanCss = require('gulp-clean-css'),
	uglifyES = require('gulp-uglify-es'),
	useMin = require('gulp-usemin'),
	rev = require('gulp-rev'),
	del = require('del'),
	ngAnnotate = require('gulp-ng-annotate'),
	pump = require('pump'),
	notify = require('node-notifier'),
	imageMin = require('gulp-imagemin'),
	sourceMaps = require('gulp-sourcemaps'),
	htmlMin = require('gulp-htmlmin');

gulp.task('default', ['browser-sync'], function defaultTask() {
});

gulp.task('browser-sync', ['nodemon'], function browserSyncTask() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
		files: ["./**/*.*"],
		browser: "firefox",
		port: 3001
	});
});
gulp.task('nodemon', function nodemonTask(cb) {

	let started = false;

	return nodemon({script: 'bin/www'})
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
	return gulp.start(
		'useMin',
		'copyfonts',
		'copyviews',
		'imageMin',
		'favicon'
	);
});

gulp.task('useMin', function minifyIt() {
	return pump([
			gulp.src('./public/index.html'),
			useMin({
				html: [htmlMin({collapseWhitespace: true})],
				css : [
					sourceMaps.init(),
					cleanCss(),
					rev(),
					sourceMaps.write()
				],
				js  : [
					sourceMaps.init(),
					ngAnnotate(),
					uglifyES.default(),
					rev(),
					sourceMaps.write()
				]
			}),
			gulp.dest('./dist/')
		], (err) => {
			if (err) {
				notify.notify(err);
			}
		}
	);
});

gulp.task('copyfonts', function copyfonts() {
	return gulp.src(
		[
			'./public/bower_components/bootstrap/dist/fonts/*.{ttf,woff,eof,svg}*',
			'./public/bower_components/font-awesome/fonts/*.{ttf,woff,eof,svg}*'
		])
	           .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copyviews', function copyViews() {
	return gulp.src('./public/views/*.html')
	           .pipe(htmlMin({collapseWhitespace: true}))
	           .pipe(gulp.dest('./dist/views'));
});

gulp.task('imageMin', function imagemin() {
	return gulp.src('./public/images/*')
	           .pipe(imageMin())
	           .pipe(gulp.dest('./dist/images'))
});

gulp.task('favicon', function moveFavicon() {
	return gulp.src('./public/favicon.ico')
	           .pipe(gulp.dest('./dist'));
})