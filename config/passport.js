var auth = require('./auth.js');
var Member = require('../models/member.js');
var url = require('url');

var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook');

module.exports = function(passport) {

  passport.serializeUser(function(member, done) {
    done(null, member);
    console.log(member);
  })

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  })


  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    process.nextTick(function(){
      Member.findOne({ "username" : username }, function(err, member) {
        if(err) { return done(err); }
        if(!member) {
          return done(null, false, { notif: 'There is no user!' });
        }
        if(!member.validatePass(password)) {
          return done(null, false, { notif: 'Invalid username or password' });
        }
        return done(null, member);
        // passport
        // return done(null, user);
      })
    })
  }
  ))

  passport.use(new FacebookStrategy({
    clientID      : auth.facebook.api_key,
    clientSecret  : auth.facebook.api_secret,
    callbackURL   : auth.facebook.callbackUrl,
    profileFields : ['id', 'displayName', 'link', 'photos', 'emails']
  },
    function(accessToken, refreshToken, params, profile, done) {
      process.nextTick(function() {
        profile.auth = {
          accessToken: accessToken
        }
        console.log(params);
        return done(null, profile);
      })
    }
  ))


}

