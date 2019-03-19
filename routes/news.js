const express = require('express');
const router = express.Router();
const axios = require('axios');
const convert = require('xml-js');



async function requestZakupkiNews(){
    const response = await axios.get('http://zakupki.gov.ru/epz/main/public/news/rss');
    return (JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4})).rss.channel.item);
}


router.get('/', async(req, res)=>{
    const news = await requestZakupkiNews();
    res.send(news)
});
module.exports = router;
