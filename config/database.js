const mysql = require('mysql2/promise');
const dbConnection = mysql.createConnection({
    host: process.env.MYSQL_URL,
    user: "root",
    password: "",
    database: "remotepatient",
    multipleStatements: true
});
module.exports = dbConnection;