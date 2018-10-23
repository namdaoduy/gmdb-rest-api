const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));




//  REST API routes
const movieRoutes = require('./api/routes/movieRoute');
app.use('/api', movieRoutes);


app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})