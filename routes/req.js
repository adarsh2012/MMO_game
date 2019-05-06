const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const User = require('../db_schema/user.js');
router.post('/register', (req,res) => {
    const { email, name, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if(errors.length > 0){
        res.render('index',{errors});
    } else {
        User.findOne({ email: email }).then(user => {
            if(user){
                errors.push({msg:"Email already in use"});
                res.render('index',{errors});
            } else {
                const newUser = new User({name,email,password});
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password,salt, (err,hash) => {
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg',"Registered correctly");
                                res.redirect('/');
                        });
                    });
                });
            };
        });
    };
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  });

router.get('/logout', (req,res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;