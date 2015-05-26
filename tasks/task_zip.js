var zip = require('gulp-zip');
var util = require('./lib/util');

module.exports = function (gulp, config) {

    gulp.task('zip', ['build_dist'], function (cb) {
        gulp.src('./src/**/*')
            .pipe(zip(config.projectName + '.zip'))
            .pipe(gulp.dest('./'))
            .on('end', function () {
                util.load_plugin('zip');
                cb();
            });
    });
};
