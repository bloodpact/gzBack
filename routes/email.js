const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars');
const {hbsOpts, transportOpts} = require('../helpers/emailOpts');


router.get('/', function (req, res, next) {
    let transporter = nodeMailer.createTransport(transportOpts);
    transporter.use('compile', hbs(hbsOpts));
    let linksArr = req.query.links.map(el=>{
        if(!el.includes("http")){
            el = 'http://zakupki.gov.ru' + el
        }
        return el
    });

    let mailOptions = {
        from:'zakupkigov.grabber@mail.ru',
        subject: 'tenders',
        to: req.query.user,
        context:{
            links: linksArr
        }
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    res.end();
});

module.exports = router;