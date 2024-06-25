const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    bankName: String,
    propertyName: String,
    city: String,
    borrowerName: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Case', caseSchema);

