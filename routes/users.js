const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            console.log(err)
            return next(err);
        }
        if (!user) {
            return res.status(401).send([user, "Cannot log in", info])
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign(user.toJSON(), 'gzGrabberSecret');
            return res.status(200).json({user, token});
        })
    })(req, res, next)
})
router.get('/register', (req, res)=>{
    res.render('users/register')
});
router.post('/register', (req, res)=>{
    let errors =[];
    if (req.body.password !== req.body.password2) {
        errors.push({msg: 'Passwords do not match'});
    }
    if (req.body.password.length < 4){
        errors.push({msg: 'Password should have more than 4 characters'});
    }
    if (errors.length > 0){
        res.status(403).json(errors)
    } else {
        User.findOne({email: req.body.email})
            .then(user=>{
                if(user){
                  errors.push({msg:'Email is already registered'})
                  return  res.status(403).json(errors)
                }else{
                    const newUser = new User({
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if (err) throw  err;
                            newUser.password = hash;
                            newUser.save()
                            .catch(err=>{
                            console.log(err);
                        })
                    })
                });
            }
        });
    }
    res.end('registered')
});
module.exports = router;