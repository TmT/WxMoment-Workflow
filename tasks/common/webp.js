/**
 * Created by littledu on 15/5/2.
 */
var rd = require('rd');
var gulp = require('gulp');
var path = require('path');
var async = require('async');
var webp = require('gulp-webp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var util = require('./../lib/util');
var fs = require('fs');

module.exports = function (config, cb) {

    var webpScript = '<script>function webpsupport(a){var c=window.localStorage;if(typeof a!="function"){a=function(){}}if(c!=undefined&&c._tmtwebp!=undefined&&c._tmtwebp==0){a();return false}else{if(c!=undefined&&c._tmtwebp!=undefined&&c._tmtwebp==1){a(1);return true}else{var f=new Image();f.onload=f.onerror=function(){if(f.height!=2){if(c!=undefined){c._tmtwebp=0}a();return false}else{if(c!=undefined){c._tmtwebp=1}a(1);return true}};f.src="data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"}}};;(function(){function b(t){var f=document.getElementsByTagName("link");for(var e=0,d=f.length;e<d;e++){if(t){f[e].href=f[e].getAttribute("data-href").replace(".css",".webp.css");}else{f[e].href=f[e].getAttribute("data-href")}}}webpsupport(b);})();</script></head>';

    var webp_map = {};    //为了筛选webp而构建的对象
    var img_arr = [];     //筛选出来需要转换成 webp 的图片
    var img_map = {};     //返回给全局作 preload 判断使用{"img_name": 1, "img_name": 0} 1 为可优化成 webp
    var reg = null;

    function render_webp(src){
        if(!fs.existsSync(src)) return;

        rd.eachFileSync(src, function (file, stats) {
            var extname = path.extname(file);
            var basename = path.basename(file, extname);
            if (!(basename in webp_map)) {
                webp_map[basename] = {};
                webp_map[basename]['size'] = stats.size;
                webp_map[basename]['extname'] = extname;
            } else {
                if ((webp_map[basename]['size'] > stats.size) && (extname === '.webp')) {
                    img_arr.push(basename + webp_map[basename]['extname']);
                    img_map[basename + webp_map[basename]['extname']] = 1;
                } else {
                    img_map[basename + webp_map[basename]['extname']] = 0;
                }
            }
        });
    }

    async.series([
        function (cb) {
            gulp.src('./dist/sprite/**/*')
                .pipe(webp())
                .pipe(gulp.dest('./dist/sprite'))
                .on('end', cb);
        },
        function (cb) {
            gulp.src('./dist/img/**/*')
                .pipe(webp())
                .pipe(gulp.dest('./dist/img'))
                .on('end', cb);
        },
        //智能寻找 webp
        function (cb) {
            render_webp('./dist/img');
            cb();
        },
        function (cb) {
            render_webp('./dist/sprite');
            reg = eval('/(' + img_arr.join('|') + ')/ig');
            cb();
        },
        function (cb) {
            gulp.src(['./dist/css/**/*.css', '!./dist/css/**/*.webp.css'])
                .pipe(rename({suffix: '.webp'}))
                .pipe(replace(reg, function (match) {
                    return match.substring(0, match.lastIndexOf('.')) + '.webp';
                }))
                .pipe(gulp.dest('./dist/css'))
                .on('end', cb);
        },
        function (cb) {
            var preload_script = '<script>window.img_map = ' + JSON.stringify(img_map) + '</script>';

            gulp.src('./dist/html/**/*.html')
                .pipe(replace('data-href', 'href'))
                .pipe(replace(/(link.*?)href/ig, '$1data-href'))
                .pipe(replace('</head>', webpScript))
                .pipe(replace('</head>', preload_script))
                .pipe(gulp.dest('./dist/html'))
                .on('end', cb);
        }

    ], function () {
        util.task_log('task_webp');
        cb();
    })
}
