var async = require('async');
var _ = require('lodash');
var copy = require('gulp-copy');
var less = require('gulp-less');
var ejs = require('gulp-ejs');
var watch = require('gulp-watch');
var ejshelper = require('tmt-ejs-helper');
var util = require('./lib/util');
var bs = require('browser-sync').create();
var fs = require('fs');
var path = require('path');

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

    function file_process(vinyl){
        var file = vinyl.history[0];
        var event = vinyl.event;
        var fileBase = file.slice(file.indexOf('src')+4);
        file = path.join('./', file.slice(file.indexOf('src')));

        if(event == "unlink"){
            var remote = path.join('./', 'dev/', fileBase);
            fs.unlink(remote);
        }
        return file;
    }
    var task_img = function (cb) {
        var file = (typeof cb == 'string')?cb:['./src/img/**/*'];
        cb = check_cb(cb);
        util.task_log('task_img');
        gulp.src(file).pipe(copy('./dev/', {prefix: 1})).on('end', cb);
    };

    var task_slice = function (cb) {
        var file = (typeof cb == 'string')?cb:['./src/slice/**/*'];
        cb = check_cb(cb);
        util.task_log('task_slice');
        gulp.src(file).pipe(copy('./dev/', {prefix: 1})).on('end', cb);
    };

    var task_js = function (cb) {
        var file = (typeof cb == 'string')?cb:['./src/js/**/*'];
        cb = check_cb(cb);
        util.task_log('task_js');
        gulp.src(file).pipe(copy('./dev/', {prefix: 1})).on('end', cb);
    };

    var task_media = function (cb) {
        var file = (typeof cb == 'string')?cb:['./src/media/**/*'];
        cb = check_cb(cb);
        util.task_log('task_media');
        gulp.src(file).pipe(copy('./dev/', {prefix: 1})).on('end', cb);
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
        var file = (typeof cb == 'string')?cb:['./src/html/**/*.*', '!./src/html/_*/**.html'];
        cb = check_cb(cb);
        util.task_log('task_html');
        gulp.src(file,{base:"./src/html/"})
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

        watch('./src/img/**/*', {verbose: true}, function (vinyl) {
            var file = file_process(vinyl);
            task_img(file);
            config.livereload && bs.reload();

        });

        watch('./src/slice/**/*', {verbose: true}, function (vinyl) {
            var file = file_process(vinyl);
            task_slice(file);
            config.livereload && bs.reload();
        });

        watch('./src/js/**/*', {verbose: true}, function (vinyl) {
            var file = file_process(vinyl);
            task_js(file);
            config.livereload && bs.reload();

        });

        watch('./src/media/**/*', {verbose: true}, function (vinyl) {
            var file = file_process(vinyl);
            task_media(file);
            config.livereload && bs.reload();

        });

        watch('./src/css/**/*', {verbose: true}, function () {
            task_less();
            config.livereload && bs.reload();
        });

        watch('./src/html/**/*.html', {verbose: true}, function (vinyl) {
            var file = file_process(vinyl);
            task_html(file);
            config.livereload && bs.reload();
        });

        util.log('Watching...');

    };

};
