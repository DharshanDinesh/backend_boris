
const mongoose = require('mongoose');

const hotelSource = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rooms: [{
        name: String,
        _id: mongoose.Schema.Types.ObjectId,
    }]
});

module.exports = mongoose.model('hotelSource', hotelSource) 
