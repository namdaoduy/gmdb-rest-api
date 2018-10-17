const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const sql = require('./db')

passport.use(new LocalStrategy(
  function (username, userpass, done) {
    sql.query('SELECT * FROM users WHERE username = ?', username, (err, user)=>{
      if(err) { return done(err); }
      if(!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      if(!user.validPassword(password)) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user)
    })
  }
))

module.exports = passport;