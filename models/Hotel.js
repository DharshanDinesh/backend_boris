
const mongoose = require('mongoose');

const hotelSource = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rooms: [String]
});

module.exports = mongoose.model('hotelSource', hotelSource) 
