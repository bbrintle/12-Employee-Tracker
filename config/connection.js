var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password", // <- Your password here
    database: "employee_db",
});

module.exports = connection;