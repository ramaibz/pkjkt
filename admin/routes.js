var async = require('async');
var crypto = require('crypto');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var path = require('path');


var Member = require('../models/member.js');
require('./controller.js');

module.exports = function(app, passport) {
  app.get('/anggota', function(req, res) {
    res.render('views/login.html');
  });

  app.get('/anggota/reg', function(req, res, next) {
    res.render('views/register.html', { user: req.user || null });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

  app.get('/notif', function(req, res) {
    res.sendFile('notifboard.html', { root: path.join(__dirname, '/views') });
  })

  app.get('/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
      Member.findOne({ 'fb.id' : user.id }, function(err, member) {
        if(err) return next(err);
        if(!member) {
          req.logIn(user, function(err) {
            return res.redirect('/anggota/reg');
          })
        }
        if(member) {
          if(err) return next(err);
          if(member.status === 0) {
            return res.redirect('/notif');
          }

          var token = jwt.sign({ id: member.id, fbtoken: user.auth.accessToken }, app.get('jwtSecret'), { expiresInMinutes: 60*5 })
          req.session.fbtoken = token;
          //res.json({ token: token });
          return res.redirect('/you-re/in/the/menu');
        }
      });
    })(req, res, next);
  });

  app.get('/fbtoken', function(req, res) {
    if(!req.session.fbtoken) {
      return res.status(401).send('What are you doing?');
    }
    res.json({ token: req.session.fbtoken });
    delete req.session.fbtoken;
    console.log(req.session.fbtoken);
  })

  app.post('/auth/local', function(req, res, next) {
    passport.authenticate('local-login', { session: false }, function(err, member, info) {
      if(err) return next(err);
      if(!member) return res.status(401).send('Invalid username or password');
      if(member.status === 0) return res.status(401).send('not eligible');
      var token = jwt.sign({ id: member._id }, app.get('jwtSecret'), { expiresInMinutes: 60*5 })
      res.json({ token: token });
    })(req, res, next);
  })

  app.post('/register', addMember);
///////////
  app.get('/api/member', getMember);
  app.get('/api/member/:id', selectMember);
  app.put('/api/member/:id', approveMember);
  app.delete('/api/member/:id', deleteMember);
///////////
  app.get('/api/profile', getProfile);
  app.put('/api/update/role/:id', updateRole);

  app.get('/lupa/password', function(req, res, next) {
    async.waterfall([
        function(done) {
          crypto.randomBytes(15, function(err, buf) {
            var token = buf.toString('hex');
            console.log(token);
          })
        }
      ], function(err) {
      if(err) return next(err);
      res.redirect('/lupa/password');
    })
  })

  app.get('/redirect', function(req, res) {
    res.redirect('/you-re/in/the/menu');
  })
  app.get('/you-re/*', function(req, res) {
    res.render('views/anggota.html', { id: req.params.username })
  })
  app.get('/you-re/in/the/menu', function(req, res, next) {
    res.render('views/anggota.html', { user: req.user });
  })

  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token');
    }
  });
}
