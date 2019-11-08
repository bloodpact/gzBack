const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');
const axios = require('axios');
const convert = require('xml-js');
const moment = require('moment')
require('../models/Link');
const Link = mongoose.model('links');

async function getLinks(userID){
    return await  Link.find({user: userID})
                      .then(links => {
                          return links
                      })
                      .catch (err=>{
                          return res.status(400).json({msg:err})
                      });
}
async function requestToFindTenders(word, from ,to){
    const response = await axios.get('http://zakupki.gov.ru/epz/order/extendedsearch/rss.html?', {
        params: {
            searchString: word,
            publishDateFrom:from,
            publishDateTo:to,
            recordsPerPage:'_10'
        },
        headers: {
            'accept': 'application/json',
            'content-type': 'text/plain;charset=utf-8'
        }
    });
    return (JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4})).rss.channel.item);
}
async function getArrTenders(userID, from, to){
    const arrWords = await getLinks(userID);
    try{
        return  await Promise.all(arrWords.map(async (currentValue, i ) => {
            //check for 24 hours or range of dates, smthng wrong with
            // calculating dates on server
            // special promise to get return from timeout
               const promiseToReturnFromTimeOut = () => new Promise(res => {
                    setTimeout(async() => {
                        if (currentValue.check24){
                            res(await requestToFindTenders(currentValue.wordFind,
                                (from),
                                (to)))
                        }else{
                            res (await requestToFindTenders(currentValue.wordFind,
                                (currentValue.dateFromP),
                                (currentValue.dateToP)));
                        }
                    }, i * 1000);
                })
                async function f() {
                    return  await promiseToReturnFromTimeOut()
                }
                return  f()
        })
        )
    } catch (err){
        console.log(err);
        return err
    }
}

router.get('/',ensureAuthenticated, async(req, res)=>{
    try {
        const tenders = await getArrTenders(req.query.user, req.query.from, req.query.to);
        res.send([].concat.apply([], tenders))
    } catch (e) {
        res.send(e)
    }

});
module.exports = router;
