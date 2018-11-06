const sql = require('../config/db');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
module.exports = {
  getUser: function(req, res) {
    const token = req.headers['x-access-token']
    if(!token) return res.status(401).send({auth: false, message: 'No token provided'})
    jwt.verify(token, config.secret, (err, decoded)=>{
      if(err) res.status(500);
      else res.status(200).send(decoded.user)
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
  },

  login: function(req, res) {
    sql.query('SELECT * FROM users WHERE username = ?', req.body.username, (err, user)=>{
      if(err) return res.status(500).send('Error on the server');
      if(!user) return res.status(404).send('No user found');

      const passwordIsValid = bcrypt.compareSync(req.body.userpass, user.userpass);
      if(!passwordIsValid) return res.status(401).send({auth: false, token: null})
      else {
        const token = jwt.sign({id: user_id}, config.secret, {expiresIn: 86400});
        res.status(200).send({auth: true, token: token});
      }
    })
  }
}