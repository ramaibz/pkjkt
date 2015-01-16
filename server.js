// init framework
var express = require('express');
var app     = express();
var router  = express.Router();

// CORS
//var cors    = require('cors');
//app.use(cors());

// init essential
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var session         = require('express-session');
var cookies         = require('cookie-parser');
var morgan          = require('morgan');
var helmet          = require('helmet');
var passport        = require('passport');
var favicon         = require('serve-favicon');
var expressJwt      = require('express-jwt');
var jwt             = require('jsonwebtoken');

// init database
var mongoose    = require('mongoose');
var db          = require('./config/db.js');

// port
var port = process.env.PORT || 9876;

// essential middleware
app.use(helmet());
app.use(cookies('p4rk0uRj4ka12tA', {
    httpOnly: true,
    secure: true
}));
app.use(session({
    secret: 'p4rk0uRj4ka12tA',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('dev'));

// JWT
app.set('jwtSecret', 'p4rk0uRj4ka12tA');
app.use('/api', expressJwt({ secret: app.get('jwtSecret') }));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport.js')(passport);

// templating engine
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'dist')));

app.set('views', __dirname + '/dist/');

// connecting database
mongoose.connect(db.dev, function(err, res) {
    if(err) {
        console.log('cannot connect database: ' + err );
    }
    else {
        console.log('connected to database');
    }
})

var listeners = mongoose.connection;
listeners.on('error', console.error.bind(console, 'connection error'));

require('./admin/postController.js')(app);
// routing
require('./index/routes.js')(app);
require('./article/routes.js')(app);
require('./email/routes.js')(app);
require('./photos/routes.js')(app);
require('./videos/routes.js')(app);
require('./admin/routes.js')(app, passport);
// start server
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('PKJKT: listening at http://%s:%s', host, port)

})
