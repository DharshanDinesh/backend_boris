
const mongoose = require('mongoose');

const accounts = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('accounts', accounts) 
