const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const port = process.env.PORT || 3000;

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// passport configuration
app.use(passport.initialize());
app.use(passport.session())
app.use(require('./config/passport'))

//  REST API routes
const movieRoutes = require('./api/routes/movieRoute');
app.use('/api', movieRoutes);

// catch 404 and forward to error handler 
app.use((req, res, next)=>{
  const err = new Error('Not Found')
  err.status = 404;
  next(err)
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})