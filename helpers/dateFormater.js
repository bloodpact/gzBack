//for query to zakupki.gov
const moment = require('moment')
module.exports ={
    formateDateAsync: async function (date) {
       return await moment(date).format("DD.MM.YYYY")
    },
    formateDate:  function (date) {
        return  moment(date).format("DD.MM.YYYY")
    }
};
