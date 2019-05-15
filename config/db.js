'use strict'
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'gmdbadmin'
});

db.connect((err)=>{
    if(err) throw err;
    console.log('DATABASE OK!')
})

module.exports = db;