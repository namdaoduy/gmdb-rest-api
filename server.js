const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
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
// app.use(passport.initialize());
// app.use(passport.session())
// app.use(require('./config/passport'))

//  REST API routes
const movieRoutes = require('./routes/movieRoute');
const userRoutes = require('./routes/userRoute');
const commentRoutes = require('./routes/commentRoute');
app.use('/api', movieRoutes);
app.use('/api', userRoutes);
app.use('/api', commentRoutes);

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