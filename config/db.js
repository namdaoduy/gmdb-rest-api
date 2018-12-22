'use strict'
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'db4free.net',
  user: process.env.DB_USER || 'gmdbadmin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'gmdb_database'
});

db.connect((err)=>{
    if(err) throw err;
    console.log('DATABASE OK!')
})

module.exports = db;