var gulp = require('gulp')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var htmlMin = require('gulp-htmlmin')
var rename = require('gulp-rename')
gulp.task('js', function () {
  return gulp
    .src('src/share.js')
    .pipe(uglify())
    .pipe(gulp.dest('src/agreement/dist'))
})
gulp.task('css', function () {
  return gulp
    .src('src/default.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('src/agreement/dist'))
})
gulp.task('html', function () {
  var opts = {
    collapseWhitespace: true,
    collapseTabs: true,
    collapseBooleanAttributes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true
  }
  return gulp
    .src('src/share.html')
    .pipe(htmlMin(opts))
    .pipe(gulp.dest('src/agreement/dist'))
})
gulp.task('html-re', function () {
  return gulp
    .src('src/agreement/dist/share.html')
    .pipe(rename("share.ejs"))
    .pipe(gulp.dest('src/agreement/dist'))
})
gulp.task('build-w', function () {
  gulp.watch('src/share.js',gulp.series('build'))
  gulp.watch('src/default.css',gulp.series('build'))
  gulp.watch('src/share.html',gulp.series('build'))
})
gulp.task('build',gulp.series(
  'html',
  'css',
  'js',
  gulp.parallel(
      'html-re'
  )
));