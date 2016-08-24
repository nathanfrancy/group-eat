let environmentSetupProperties = {

    dev: {
        appSettings: {
            port: 8000
        },
        logging: {
            console: true,
            rolling: true,
            rollingFile: 'appname.log',
            topLogContext: 'appname',
            level: 'ALL'
        }
    }

    // TODO: add test configuration

    // TODO: add prod configuration
};

module.exports = (function() {
    let os = require('os');
    let hostname = os.hostname();

    // TODO: detect environment based on above hostname.
    // For now, just default to 'dev' since the project is just starting.

    let env = 'dev';

    // Fallback to 'dev' if the environment is not one of the ones listed.
    if (environmentSetupProperties[env] === undefined)
        env = 'dev';

    return {
        host: hostname,
        env: env,
        config: environmentSetupProperties[env]
    };
})();