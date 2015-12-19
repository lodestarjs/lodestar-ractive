var gulp = require('gulp'),
  rm = require('gulp-rimraf'),
  less = require('gulp-less'),
  path = require('path'),
  babel = require('gulp-babel');

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

gulp.task('babel', function() {
  return gulp.src('src/js/main.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('assets/js/'));
});

gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', [ 'babel' ]);
  gulp.watch('src/less/**/*.less', [ 'less' ]);
});

gulp.task('default', ['copy', 'less', 'babel', 'watch']);

gulp.task('build', ['copy', 'less', 'babel']);