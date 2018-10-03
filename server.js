const express = require('express');
const mysql = require('mysql')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// Connect to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Quanghung291'
});
db.connect((err)=>{
    if(err){
        console.log(err);
    } else {
        console.log('MySQL Databases connected!');
    }
})

const port = process.env.PORT || 3000;
app.listen(port, (err)=>{
    if(err) throw err;
    console.log(`Server started on port ${port}`);
})