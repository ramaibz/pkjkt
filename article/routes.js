//var Article = require('../models/articles.js');
require('./controller.js');

module.exports = function(app) {
    app.get('/articles', function(req, res) {
        res.render('views/article.html')
    })

    app.post('/api/article', saveArticle);
    app.get('/api/article', getArticle);
    app.get('/api/article/:id');
    app.put('/api/article/:id');
    app.delete('/api/article/:id');
}
