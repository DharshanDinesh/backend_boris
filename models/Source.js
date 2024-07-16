
const mongoose = require('mongoose');

const sourceFrom = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('sourceFrom', sourceFrom) 
