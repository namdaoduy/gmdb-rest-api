const fs = require('fs'),
  request = require('request');

const download = function(uri, filename, callback) {
  const filepath = './public/images/' + filename;
  request.head(uri, (err, res)=>{
    request(uri).pipe(fs.createWriteStream(filepath)).on('close', callback);
  });
};

module.exports = download;