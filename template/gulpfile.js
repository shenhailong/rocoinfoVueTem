var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var cleanCSS = require('gulp-clean-css')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var plumber = require('gulp-plumber')
// var rename = require('gulp-rename')
var notify = require('gulp-notify')
var plumberOptions = {
  errorHandler: notify.onError('Error:<%= error.message %>')
}

// 样式编译
gulp.task('sass', function () {
  var array = [
    `./src/scss/style.scss`
  ]
  gulp.src(array)
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 20 versions', 'ie > 8']
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./static/css'))
    .pipe(browserSync.stream())
})

gulp.task('rocoui', function () {
  gulp.src('./node_modules/rocoui/dist/**')
    .pipe(gulp.dest('./static/vendor/rocoui/'))
})

// 开发用
gulp.task('server', ['sass'], function () {
  browserSync.init({
    server: '.'
  })
  gulp.watch('./src/scss/**/*.scss', ['sass'])
  gulp.watch('./src/html/*.html').on('change', browserSync.reload)
  gulp.watch('./src/templates/*.html').on('change', browserSync.reload)
})


var fontSpider = require('gulp-font-spider');

gulp.task('fontspider', function () {
  return gulp.src('./src/html/spider.html')
    .pipe(fontSpider());
});


// 默认任务即为发布
gulp.task('default', ['server'])
