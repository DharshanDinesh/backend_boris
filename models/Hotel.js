
const mongoose = require('mongoose');

const hotelSource = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('hotelSource', hotelSource) 
