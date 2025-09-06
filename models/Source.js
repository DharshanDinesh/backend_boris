
const mongoose = require('mongoose');

const sourceFrom = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    commission: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
});

module.exports = mongoose.model('sourceFrom', sourceFrom) 
