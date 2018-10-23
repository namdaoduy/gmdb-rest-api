const localStrategy = require('passport-local').Strategy();
const crypto = require('cryptop')
const db = require('../../db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Passport Local Strategy 
passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'userpass',
  passReqToCallback: true
}, function (req, username, userpass, done) {
      if(!username || !userpass) {
        return done(null, false);
      }
      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, rows)=>{
        if(err) return done(err, null);
        if(!rows.length) {
          return done(null, false);
        }
        salt = salt + '' + userpass;
        const encUserpass = crypto.createHash('sha1').update(salt).digest('hex');
        const dbUserpass = rows[0].userpass;

        if(!(dbUserpass.equals(encUserpass))) {
          return done(null, false);
        }
        req.session.user = rows[0];
        return done(null, rows[0])
      })
}))

passport.serializeUser((user, done)=>{
  return done(null, user.id);
})

passport.deserializeUser((id, done)=>{
  db.query('SELECT * FROM users WHERE user_id = ?', id, (err, rows)=>{
    return done(err, rows[0]);
  })
})


module.exports = passport;