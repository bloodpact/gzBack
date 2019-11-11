const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const {transportOpts} = require('../helpers/emailOpts');
router.get('/', function (req, res) {
    async function main() {
        let linksArr = req.query.links.map(el=>{
            if(!el.includes("http")){
                el = `<a href="http://zakupki.gov.ru${el}">http://zakupki.gov.ru${el}</a><br>`
            } else{
                el = `<a href="${el}">${el}</a><br>`
            }
            return el
        });

        let transporter = nodeMailer.createTransport(transportOpts);

        let info = await transporter.sendMail({
            from: 'zakupkigov.grabber@mail.ru', // sender address
            to: req.query.user, // list of receivers
            subject: 'Тендеры', // Subject line
            text: 'Тендеры', // plain text body
            html: `<p>${linksArr}</p>` // html body
        });
        console.log('Message sent: %s', info.messageId);
    }
    main().then(res.end()).catch(console.error);
});
module.exports = router;