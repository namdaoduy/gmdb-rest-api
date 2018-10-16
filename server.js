const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
// Configure Express App
const app = express();

// Passport authentication


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// movieRouteAPI 
const movieRoutes = require('./api/routes/movieRoute');
app.use('/api', movieRoutes);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})