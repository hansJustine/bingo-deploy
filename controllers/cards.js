const { createBingoCards } = require('../utils/createBingoCards');
const generateBase64Images = require('../utils/generateBase64');
const { sendImageToEmail } = require('../utils/sendImageToEmail');
const base64ToImage = require('base64-to-image');
const nodemailer = require('nodemailer');
const BingoCard = require('../models/bingoCard');
const GameSession = require('../models/gameSession');


module.exports.bingoCardForm = async (req, res) => {
    let gameSession = await GameSession.find({});
    res.render('bingoCardForm', { gameSession });
}

//SEND IMAGE TO EMAIL
module.exports.createBingoCard = async (req, res) => {
    const { playerName, playerPhoneNum, cardQty, email, gameSession } = req.body.info;
    const playerInfo = new BingoCard({ playerName, playerPhoneNum });
    let cardsGenerated = await createBingoCards(cardQty, playerInfo._id);
    playerInfo.cards = cardsGenerated;
    const images = await generateBase64Images(playerInfo);
    let attachments = [];
    for (let image of images) {
        attachments.push({ path: image });
    }
    await sendImageToEmail(email, attachments);
    playerInfo.images = images;
    let updatedGameSes = await GameSession.findByIdAndUpdate(gameSession, { $push: { players: playerInfo } }, { new: true });
    playerInfo.gameSession = updatedGameSes;
    await playerInfo.save();
    req.flash('success', 'Successful genarating bingo cards!');
    res.redirect('/');
}

module.exports.createGameSession = async (req, res) => {
    const gameSession = new GameSession({sessionName: req.body.gameSession.sessionName});
    await gameSession.save();
    req.flash('success', 'Successful creating game session!');
    res.redirect('/');
}





//CREATE-CARD SAVE IMAGE TO DRIVE
// module.exports.createBingoCard = async (req, res) => {
//     const { playerName, playerPhoneNum, cardQty } = req.body.info;
//     const playerInfo = new BingoCard({ playerName, playerPhoneNum });
//     playerInfo.cards = await createBingoCards(cardQty, playerInfo._id);
//     await playerInfo.save();
//     const images = await generateBase64Images(playerInfo);
//     let counter = 1;
//     for (let image of images) {
//         const path = `./cardsGenerated/`;
//         const optionalObj = { fileName: `${playerName}${counter}`, type: 'png' };
//         await base64ToImage(image, path, optionalObj);
//         counter++;
//     }
//     playerInfo.images = images;
//     await playerInfo.save();
//     res.redirect('/');
// }