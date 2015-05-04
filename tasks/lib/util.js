var async = require('async');
var util = require('gulp-util');
var path = require('path');
var fs = require('fs');
var config = require('rc')('tmtworkflow', {
    projectName: process.cwd().split(path.sep).pop()
});

var tmt_util = {
    log: function () {
        util.log.apply(util, arguments);
    },
    task_log: function (task_name) {
        this.log(util.colors.magenta(task_name), util.colors.green.bold('√'));
    },
    load_plugin: function (name, cb) {
        name = name + '_after';

        if (config['plugins'] && config['plugins'][name].length) {
            var plugins = config['plugins'][name];

            async.every(plugins, function (plugin, cb) {
                if (plugin.indexOf('.js') === -1) {
                    plugin += '.js';
                }

                var filepath = path.resolve(__dirname, '../plugins', plugin);

                if (fs.existsSync(filepath)) {
                    require(filepath)(config);
                    cb()
                } else {
                    cb();
                }
            }, function () {
                if(typeof cb === 'function'){
                    cb();
                }
            });
        }
    },
    colors: util.colors
};

module.exports = tmt_util;
