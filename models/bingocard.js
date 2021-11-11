const mongoose = require('mongoose');

const bingoCardShema = new mongoose.Schema({
    playerName: String,
    playerPhoneNum: Number,
    cards: [
        {
            cardInfo: [{
                lineName: String,
                line: [],
                winnerId: String,
            }]
        }
    ],
    createdAt: {
        type: Date,
        default: new Date()
    },
    images: [String]
});

module.exports = mongoose.model('BingoCard', bingoCardShema);