const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    port: 3306,
    database: 'schoolmanagement',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
//connection.connect();
module.exports = connection