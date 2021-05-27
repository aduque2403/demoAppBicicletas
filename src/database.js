  
const mysql = require('mysql');
const {promisify} = require('util');

const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err) {
        if(err.code === 'PROTOCOL_CONNECTION_ERROR') {
            console.log('La conexión a la base de datos a cerrado de manera inesperada.');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('No ha sido posible conectar a la base de datos por la cantidad de conexiones.');
        }
        if(err.code === 'ECONNREFUSED'){
            console.log('La conexió a la base de datos ha sido rechazada.');
        }
    }

    if (connection) {
        connection.release();
        console.log('DB is connected');
    }
    return;

});

//promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;