
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    checkIn: Date,
    dateOfEntry: Date,
    checkOut: Date,
    file: [{
        url: String,
        fileType: String,
        name: String
    }], // Array of photo URLs
});

module.exports = mongoose.model('Customer', CustomerSchema) 
