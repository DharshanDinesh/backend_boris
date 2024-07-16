
const mongoose = require('mongoose');

const currency = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('currency', currency) 
