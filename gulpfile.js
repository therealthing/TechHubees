//process.env.DISABLE_NOTIFIER = true;

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	glue = require('gulp-sprite-glue'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	gutil = require('gulp-util'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	react = require('gulp-react'),
	del = require('del'),
	babel = require('gulp-babel');

var bases = {
	app: './',
	dist: './'
};

var paths = {
	scripts: ['js/*.js'],
	jsx: ['js/*.jsx']
};


// Scripts
gulp.task('scripts', function() {
	gulp.src([bases.app + paths.scripts])
		.pipe(concat('app.js'))
		.pipe(babel())
		.pipe(gulp.dest(bases.dist + 'js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(bases.dist + 'js'))
		.pipe(connect.reload())
		.pipe(notify({ message: 'Scripts task complete'}));
});

// React
gulp.task('react', function(){
	return gulp.src(paths.jsx, {cwd: bases.app})
        .pipe(notify({message: 'React task start'}))
        .pipe(react())
	    .pipe(gulp.dest(bases.app + 'js'))
	    .pipe(notify({message: 'React task complete'}));
});

// Clean
gulp.task('clean', function(cb) {
		del([
			bases.dist + 'css/maps',
			bases.dist + 'css/app.css',
			bases.dist + 'js/app.js',
			bases.dist + 'js/app.min.js']);
});

// Server
gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    port: 8000,
    livereload: true
  });
});

// Default task
gulp.task('default', function() {
	gulp.start('react', 'scripts', 'watch', 'connect');
});

// Watch
gulp.task('watch', function() {
	gulp.watch(bases.app + paths.scripts, ['scripts']);
	gulp.watch(bases.app + paths.jsx, ['react']);
});
