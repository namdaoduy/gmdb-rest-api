const express = require('express');
const mysql = require('mysql')
const bodyParser = require('body-parser');

// Configure Express App
const app = express();

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

//// MIDDLEWARE ////
app.use(bodyParser.json());
app.use('/api/movies', require('./routes/api/movies'));

// Error Handling
app.use((req, res, err, next)=>{
        res.send({error: err.message});
})


const port = process.env.PORT || 3000;
app.listen(port, (err)=>{
    if(err) throw err;
    console.log(`Server started on port ${port}`);
})