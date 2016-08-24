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
        file: "pro-connection.log"
    });
}

var logConf = {};
logConf[env.config.logging.topLogContext] = {
    level: env.config.logging.level,
    appenders: appenders
};
comb.logger.configure(logConf);