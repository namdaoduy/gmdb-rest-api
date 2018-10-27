const sql = require('../config/db');
const bcrypt = require('bcryptjs')

module.exports = {
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
              res.json({success: true, message: "User registered"})
            }
          })
        }
      })
    })
  }
}