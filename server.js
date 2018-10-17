const app = require('express')();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// movieRouteAPI 
const movieRoutes = require('./api/routes/movieRoute');
app.use('/api', movieRoutes);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})