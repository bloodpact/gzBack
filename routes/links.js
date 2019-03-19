const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');
const {formateDate} = require('../helpers/dateFormater');
const moment = require('moment');

require('../models/Link');
const Link = mongoose.model('links');

router.get('/', ensureAuthenticated, (req, res) => {
    Link.find({
        user: req.query.user
        })
        .sort({date: 'desc'})
        .then(links => {
            res.send(links)
        })
        .catch(err=>{
        return res.status(400).json({msg:err})
    })
});

router.get('/:id',ensureAuthenticated, (req, res) =>{
    Link.findOne({
        _id: req.params.id
        })
        .then(link=>{
         res.send(link)
         })
        .catch(err=>{
         return res.status(400).json({msg:err})
    })
});

router.put('/:id',  ensureAuthenticated, (req, res)=>{
    Link.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            $set: {
                wordFind: req.body.wordFind,
                dateFrom : req.body.dateFrom,
                dateTo : req.body.dateTo,
                check24 : req.body.check24,
                dateFromP : formateDate(req.body.dateFrom),
                dateToP :formateDate(req.body.dateTo)
            }
        },
        (err) => {
            if(err){
                res.status(400).json({msg:err})
            }
        }
    );
})

router.post('/',ensureAuthenticated, (req, res) =>{
    let errors = [];
    if (!req.body.wordFind) {
        errors.push({text: "please enter the word"})
    }
    if (errors.length > 0) {
        res.send({
            errors: errors,
            wordFind: req.body.wordFind
        })
    } else {
        const newLink = {
            wordFind: req.body.wordFind,
            user: req.body.user,
            dateFrom:req.body.dateFrom,
            dateTo: req.body.dateTo,
            dateFromP: moment(req.body.dateFrom).format("DD.MM.YYYY"),
            dateToP: moment(req.body.dateTo).format("DD.MM.YYYY"),
            check24: req.body.check24
        };
        new Link(newLink)
            .save()
            .catch(err=>{
             return  res.status(400).json({msg:err})
            })
    }
})

router.delete('/:id', ensureAuthenticated,(req, res)=>{
    Link.deleteOne({
            _id: req.params.id
        })
        .then(()=>{
            res.status(200).json({msg:'successful deleted'})
        })
        .catch(err=>{
            res.status(400).json({msg:err})
        })
});

module.exports = router;