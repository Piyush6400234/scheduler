const moment = require('moment'); 



function getStandardisedData(data){
    res = {
    bankName: data['Bank Name'],
    propertyName: data['Property Name'],
    city: data['City'],
    borrowerName: data['Borrower Name'],
    createdAt: moment(data['Created At'], "DD-MM-YYYY").toDate(),
}
return res
};

module.exports = {getStandardisedData}