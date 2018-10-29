const sql = require('../config/db');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
module.exports = {
  getUser: function(req, res) {
    jwt.veriry(token, config.secret, (err, decoded)=>{
      if(err) res.status(500);
      else res.status(200).send(decoded)
    })
  },

  create: function(req, res) {
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(req.body.userpass, salt, (err, hash)=>{
        if(err) throw err;
        else {
          const newUser = {
            username: req.body.username,
            userpass: hash
          }
          sql.query('INSERT INTO users SET ?', newUser, (err, user)=>{
            if(err) {
              res.json({success: false, message: "Failed to add user"})
            } else {
              jwt.sign({user: newUser}, config.secret, (err, token)=>{
                res.status(200).json(token);
              })
            }
          })
        }
      })
    })
  }
}