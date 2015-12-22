var gulp = require('gulp'),
  rm = require('gulp-rimraf'),
  less = require('gulp-less'),
  path = require('path'),
  babel = require( 'rollup-plugin-babel' ),
  rollup = require('gulp-rollup')
  sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function() {
  return gulp.src('assets').pipe(rm());
});

gulp.task('less', function () {
  return gulp.src('./src/less/base.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('copy', function() {
  gulp.src(['node_modules/ractive/ractive.js', 'node_modules/ractive/ractive.js.map', 'node_modules/lodestar-ractive/dist/lodestar-ractive.js'])
    .pipe(gulp.dest('assets/js/'));
  gulp.src('src/fonts/**/*')
      .pipe(gulp.dest('assets/fonts/'));
  gulp.src('src/images/**/*')
      .pipe(gulp.dest('assets/images/'));
});

gulp.task('rollup', function() {
  return gulp.src('src/js/main.js', {read: false})
    .pipe(rollup({
      format: 'iife',
      moduleName: 'main',
      sourceMap: true,
      plugins: [
        babel()
      ],
      external: [ 'lodestar-ractive' ]
    }))
    .pipe(sourcemaps.write(".")) // this only works if the sourceMap option is true
    .pipe(gulp.dest('assets/js/'));
});



gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', [ 'rollup' ]);
  gulp.watch('src/less/**/*.less', [ 'less' ]);
});

gulp.task('default', ['copy', 'less', 'rollup', 'watch']);

gulp.task('build', ['copy', 'less', 'rollup']);