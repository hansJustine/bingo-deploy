const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({

    lineName: String,
    line: [],
    winnerId: String,

});

module.exports = mongoose.model('Line', lineSchema);