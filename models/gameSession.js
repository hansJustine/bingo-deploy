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
    history: [],
    bLines: [],
    iLines: [],
    nLines: [],
    gLines: [],
    oLines: [],
    rowsWo3s: [],
    row3: [],
    diagonals: []
})

module.exports = mongoose.model('GameSession', gameSessionSchema);