const sql = require('../config/db');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
module.exports = {
  getUser: function(req, res) {
    console.log(req.username);
    sql.query('SELECT * FROM users WHERE username = ?', req.username, (err, result)=>{
      console.log(result);
      if(err) return res.status(500).send(err);
      if(!result) return res.stats(404).send({message: "No user found"});
      res.status(200).send(result[0]);
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
          if(!newUser.username || !newUser.userpass) {
            res.send(err);
            return;
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
  },

  login: function(req, res) {
    sql.query('SELECT * FROM users WHERE username = ?', req.body.username, (err, user)=>{
      if(err) return res.status(500).send('Error on the server');
      if(!user) return res.status(404).send('No user found');
      const passwordIsValid = bcrypt.compareSync(req.body.userpass, user[0].userpass);
      if(!passwordIsValid) return res.status(401).send({auth: false, token: null})
      else {
        const token = jwt.sign({id: user[0].user_id}, config.secret, {expiresIn: 86400});
        res.status(200).send({auth: true, token: token});
      }
    })
  },

  logout: function(req, res) {
    res.status(200).send({auth: false, token: null});
  }
}