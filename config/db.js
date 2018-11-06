'use strict'
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Quanghung291',
    database: process.env.DB_NAME || 'gmdb'
});

db.connect((err)=>{
    if(err) throw err;
})

module.exports = db;