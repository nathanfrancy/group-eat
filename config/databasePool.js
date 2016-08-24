let mysql = require('mysql');
let env = require('./env');
let logger = require('comb').logger('ge.databasepool');

let pool  = mysql.createPool({
    host: env.safestore['database.host'],
    user: env.safestore['database.user'],
    password: env.safestore['database.pass'],
    database: env.safestore['database.database']
});

logger.info("Created database pool.");

module.exports = pool;