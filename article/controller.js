var Article = require('../models/articles.js');

saveArticle = function(req, res, next) {
  /*newArticle.title = req.body.title;
  newArticle.tags = req.body.tags;
  newArticle.content = req.body.content;
  newArticle.postedBy = req.user.id;*/
  var newArticle = new Article({
    title: req.body.title,
    tags: req.body.tags,
    content: req.body.content,
    postedBy: req.user.id
  });

  newArticle.save(function (err, data) {
    if(err) {
      res.status(400).json({ notif: err.errors })
      return next(err);
    }
    else {
      return res.status(200).json({ notif: data.title + ' successfully added!' })
    }
  })
}

getArticle = function(req, res, next) {
  Article.find(function(err, articles) {
    if(err) {
      res.status(400).json(err);
      return next(err);
    }
    else {
      return res.status(200).json(articles);
      next();
    }
  })
}
