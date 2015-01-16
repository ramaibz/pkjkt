var fs = require('fs-extra');
var file = './post.json';

module.exports = function(app) {
  var writeJson = function(files, datas, res) {
    fs.outputJson(files, datas, function(err) {
      if(err) {
        return res.status(400).json({ notif: err });
      }
      return res.status(200).json({ notif: 'Success'});
    })
  }
  app.post('/api/post/broadcast/:stat', function(req, res) {
    fs.exists(file, function(exists) {
      if(exists) {
        fs.readJson(file, function(err, data) {
          if(req.params.stat === 'training') {
            data.date = req.body.date,
            data.time = req.body.time,
            data.place = req.body.place
          }
          if(req.params.stat === 'general') {
            if(data.content.length > 2) {
              data.content.shift();
            }
            data.content.push(req.body.content);
          }
          writeJson(file, data, res);
        })
      }
      else {
        var data = {
          date: req.body.date || '',
          time: req.body.time || '',
          place: req.body.place || '',
          content: [req.body.content] || []
        }
        writeJson(file, data, res);
      }
    })
  })
}
