var async = require('async');
var _ = require('lodash');
var copy = require('gulp-copy');
var less = require('gulp-less');
var ejs = require('gulp-ejs');
var watch = require('gulp-watch');
var ejshelper = require('tmt-ejs-helper');
var util = require('./lib/util');
var bs = require('browser-sync').create();

module.exports = function (gulp, config) {
    gulp.task('build_dev', function () {
        async.parallel([
            function(cb){
                task_img(cb);
            },
            function(cb){
                task_slice(cb);
            },
            function(cb){
                task_js(cb);
            },
            function(cb){
                task_media(cb);
            },
            function(cb){
                task_less(cb);
            },
            function(cb){
                task_html(cb);
            }
        ], function(err){
            if(err){
                util.colors.red(err.message);
            }else{
                task_watch();

                util.load_plugin('build_dev', function(){
                    if(config.livereload && config.livereload.available){
                        task_server();
                    }
                });
                
            }
        });
    });

    function check_cb(cb){
        if(typeof cb != 'function'){
            cb = function(){};
        }
        return cb;
    }

    var task_img = function (cb) {
        cb = check_cb(cb);
        util.task_log('task_img');
        gulp.src('./src/img/**/*').pipe(copy('./dev/', {prefix: 1})).on('end', cb);
    };

    var task_slice = function (cb) {
        cb = check_cb(cb);
        util.task_log('task_slice');
        gulp.src('./src/slice/**/*').pipe(copy('./dev/', {prefix: 1})).on('end', cb);
    };

    var task_js = function (cb) {
        cb = check_cb(cb);
        util.task_log('task_js');
        gulp.src('./src/js/**/*').pipe(copy('./dev/', {prefix: 1})).on('end', cb);
    };

    var task_media = function (cb) {
        cb = check_cb(cb);
        util.task_log('task_media');
        gulp.src('./src/media/**/*').pipe(copy('./dev/', {prefix: 1})).on('end', cb);
    };

    var task_less = function (cb) {
        cb = check_cb(cb);
        util.task_log('task_less');
        gulp.src('./src/css/style-*.less')
            .pipe(less().on('error', function (error) {
                util.log(util.colors.red(error.message));
            }))
            .pipe(gulp.dest('./dev/css/'))
            .on('end', cb);
    };

    var task_html = function (cb) {
        cb = check_cb(cb);
        util.task_log('task_html');
        gulp.src(['./src/html/**/*.html', '!./src/html/_*/**.html'])
            .pipe(ejs(ejshelper()).on('error', function (error) {
                util.log(util.colors.red(error.message));
            }))
            .pipe(gulp.dest('./dev/html/'))
            .on('end', cb);
    };

    var task_server = function () {
        bs.init({
            server: './dev',
            port: config['livereload']['port'] || 8080,
            startPath: config['livereload']['startPath'] || '/html',
            reloadDelay: 500,
            files: ['./dev/css/style-*.css', './src/html/**/*.*']
        });
    };

    var task_watch = function () {

        watch('./src/img/**/*', {verbose: true}, function () {
            task_img();
        });

        watch('./src/slice/**/*', {verbose: true}, function () {
            task_slice();
        });

        watch('./src/js/**/*', {verbose: true}, function () {
            task_js();
        });

        watch('./src/media/**/*', {verbose: true}, function () {
            task_media();
        });

        watch('./src/css/**/*', {verbose: true}, function () {
            task_less();
            config.livereload && bs.reload();
        });

        watch('./src/html/**/*.html', {verbose: true}, function () {
            task_html();
            config.livereload && bs.reload();
        });

        util.log('Watching...');

    };

};
