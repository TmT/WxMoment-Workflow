var async = require('async');
var util = require('./lib/util');
var copy = require('gulp-copy');
var less = require('gulp-less');
var ejs = require('gulp-ejs');
var ejshelper = require('tmt-ejs-helper');
var minifyCSS = require('gulp-minify-css');
var tmtsprite = require('gulp-tmtsprite');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var usemin = require('gulp-usemin2');
var uglify = require('gulp-uglify');
var del = require('del');
var webp = require('./common/webp');

module.exports = function (gulp, config) {

    //build_dist
    gulp.task('build_dist', function (cb) {

        async.series([
            function (cb) {
                del(['./dist'], cb);
            },
            function (cb) {

                gulp.src('./src/css/style-*.less')
                    .pipe(less())
                    .pipe(minifyCSS({advanced: false}))
                    .pipe(tmtsprite())
                    .pipe(gulpif('*.png', gulp.dest('./dist/sprite/').on('end', function () {
                        end();
                    }), gulp.dest('./dist/css/').on('end', function () {
                        end();
                    })));

                var i = 0;

                function end() {
                    i++;
                    if (i >= 2) {
                        util.task_log('task_less');
                        util.task_log('task_sprite');
                        cb();
                    }
                }

            },
            function (cb) {
                gulp.src('./src/img/**/*')
                    .pipe(imagemin({
                        use: [pngquant()]
                    }))
                    .pipe(gulp.dest('./dist/img'))
                    .on('end', function () {
                        util.task_log('task_imagemin');
                        cb();
                    })
            },

            function (cb) {
                gulp.src('./dist/sprite/**/*')
                    .pipe(imagemin({
                        use: [pngquant()]
                    }))
                    .pipe(gulp.dest('./dist/sprite'))
                    .on('end', function () {
                        util.task_log('task_spritemin');
                        cb();
                    });
            },

            function (cb) {
                gulp.src('./src/media/**/*')
                    .pipe(copy('./dist/', {prefix: 1}))
                    .on('end', function () {
                        util.task_log('task_media');
                        cb();
                    });
            },
            function (cb) {
                gulp.src('./src/js/**/*')
                    .pipe(uglify())
                    .pipe(gulp.dest('./dist/js'))
                    .on('end', function () {
                        util.task_log('task_js');
                        cb();
                    });
            },
            function (cb) {

                gulp.src(['./src/html/**/*.html', '!./src/html/_*/**/*.html'])
                    .pipe(ejs(ejshelper()))
                    .pipe(usemin({
                        jsmin: uglify()
                    }))
                    .pipe(gulp.dest('./dist/html'))
                    .on('end', function () {
                        util.task_log('task_ejs');
                        util.task_log('task_jsmin');
                        cb();
                    });
            },
            function (cb) {
                if (config['support_webp']) {
                    webp(config, cb);
                } else {
                    cb();
                }
            }

        ], function () {
            util.load_plugin('build_dist');
            cb(null);
        })
    });
};

