module.exports.error = {
    handler_404: require('./errors/error_404'),
    handler_dev: require('./errors/error_dev'),
    handler_prod: require('./errors/error_prod')
};