module.exports = function(app) {
    app.get('/email', function(req, res) {
        res.render('views/email.html')
    })
}