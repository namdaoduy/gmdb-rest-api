const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
<<<<<<< HEAD
const session = require('express-session')
=======
>>>>>>> 034c6da1d2384ad936f69945a1ad841a94165b64
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
<<<<<<< HEAD
// app.use(passport.initialize());
// app.use(passport.session())
// app.use(require('./config/passport'))
=======
app.use(passport.initialize());
app.use(passport.session())
app.use(require('./config/passport'))
>>>>>>> 034c6da1d2384ad936f69945a1ad841a94165b64

//  REST API routes
const movieRoutes = require('./routes/movieRoute');
const userRoutes = require('./routes/userRoute')
app.use('/api', movieRoutes);
<<<<<<< HEAD
app.use('/api', userRoutes);
=======
>>>>>>> 034c6da1d2384ad936f69945a1ad841a94165b64

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