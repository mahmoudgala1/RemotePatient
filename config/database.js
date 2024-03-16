const mysql = require('mysql2/promise');
const dbConnection = mysql.createConnection({
    host: process.env.MYSQL_URL,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DATABASE_NAME,
    multipleStatements: true
});
module.exports = dbConnection;