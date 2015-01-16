var Member = require('../models/member.js');

getProfile = function(req, res, next) {
  return Member.findById(req.user.id, 'name role status', function(err, member) {
    if(err) {
      res.status(400).json({ notif: err });
      next(err);
    }
    else {
      res.status(200).json(member);
      next();
    }
  })
}

getMember = function(req, res) {
  return Member.find({}, 'name mobile role status fb.id username', function(err, members) {
    if(err) {
      return res.status(400).json(err);
    }
    else {
      return res.status(200).json(members);
    }
  })
}

addMember = function(req, res, next) {
  var newMember = new Member();
    if(req.user) {
      newMember.fb.id    = req.user.id;
      newMember.fb.link  = req.user.link;
    }
    newMember.username = req.body.username;
    newMember.name     = req.body.fullname;
    newMember.email    = req.body.email;
    newMember.password = newMember.genHash(req.body.password);
    newMember.name     = req.body.fullname;
    newMember.mobile   = req.body.mobile;

  Member.findOne({ 'email' : newMember.email }, function(err, member) {
    if(err) {
      next(err);
    }
    if(member) {
      res.status(400).json({ error: 'Member already exist' });
      next();
    }
    else {
      newMember.save(function(err, data) {
        if(err) {
          res.status(400).json({ notif: err });
          next();
        }
        else {
          req.logout();
          res.redirect('/notif');
          next();
        }
      })
    }
  })
}

selectMember = function(req, res, next) {
  Member.findById(req.params.id, function(err, member) {
    if(err) return next(err);
    res.json(member);
    next();
  })
}

updateMember = function(req, res, next) {
  Member.findById(req.params.id, function(err, member) {

  })
}

deleteMember = function(req, res, next) {
  Member.findById(req.params.id, function(err, member) {
    member.remove(function(err) {
      res.json(member);
      next();
    })
  })
}

approveMember = function(req, res, next) {
  Member.findById(req.params.id, 'status', function(err, member) {
    member.status = req.body.status;
    member.save(function(err) {
      if(err) {
        return res.status(401).send({ notif: err });
      }
      res.json({ notif: 'Success'});
      next();
    });
  })
}

updateRole = function(req, res, next) {
  Member.findByIdAndUpdate(req.params.id, { role: req.body.role });
}
