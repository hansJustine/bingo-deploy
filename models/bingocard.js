const mongoose = require('mongoose');


const bingoCardShema = new mongoose.Schema({
    gameSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameSession'
    },
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