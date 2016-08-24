var comb = require('comb');
var env = require('./../config/env');

// Configure logging appenders based on current environment.
var appenders = [];
if (env.config.logging.console) {
    appenders.push({
        type: "ConsoleAppender"
    });
}
if (env.config.logging.rolling) {
    appenders.push({
        type: "RollingFileAppender",
        file: env.config.logging.rollingFile
    });
}

var logConf = {};
logConf[env.config.logging.topLogContext] = {
    level: env.config.logging.level,
    appenders: appenders
};
comb.logger.configure(logConf);