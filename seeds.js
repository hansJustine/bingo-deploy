const mongoose = require('mongoose');
const BingoCard = require('./models/bingocard');
const {createBingoCards} = require('./createBingoCards');
require('dotenv').config();

const seedDb = async () => {
    await BingoCard.deleteMany({});

    for (let i = 0; i < 2; i++) {
        const random5 = Math.floor(Math.random() * 5) + 1;
        const playerInfo = new BingoCard({
            playerName: 'Hans',
            playerPhoneNum: 09183115689
        })
        playerInfo.cards = await createBingoCards(random5, playerInfo._id);
        await playerInfo.save();
    }
}



mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
    .then(() => {
        console.log('Mongo connected!')
        seedDb().then(() => {
            console.log('Success!')
            mongoose.connection.close();
        });
    })
    .catch((err) => console.log('Error! ', err));
