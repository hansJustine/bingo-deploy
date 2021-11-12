const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    sessionName: String,
    isDone: false,
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BingoCard'
        }
    ],
    winners: [],
    bLines: [],
    iLines: [],
    nLines: [],
    gLines: [],
    oLines: [],
    rowsWo3s: [],
    diagonals: [{
        _id: mongoose.Schema.Types.ObjectId,
        lineName: String,
        line: [],
        winnerId: String
    }]
})

module.exports = mongoose.model('GameSession', gameSessionSchema);