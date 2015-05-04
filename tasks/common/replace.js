/**
 * Created by littledu on 15/5/3.
 */
var gulp = require('gulp');
var replace = require('gulp-replace');

module.exports = function(src, path, cb){
    gulp.src(src)
        .pipe(replace('../css/', path +  '/dist/css/'))
        .pipe(replace('../js/', path + '/dist/js/'))
        .pipe(replace('../img/', path + '/dist/img/'))
        .pipe(replace('../media/', path + '/dist/media/'))
        .pipe(gulp.dest('./dist/html'))
        .on('end', function(){
            cb();
        });
}
