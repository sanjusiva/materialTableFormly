const mongoose = require('mongoose');

var Table = mongoose.model('Table', {
    securityType:{type:String},
    Description: { type: String },
    Category: { type: String }
});

module.exports = { Table };