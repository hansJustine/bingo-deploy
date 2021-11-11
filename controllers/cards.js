const createBingoCards = require('../utils/createBingoCards');
const generateBase64Images = require('../utils/generateBase64');
const base64ToImage = require('base64-to-image');
const nodemailer = require('nodemailer');
const BingoCard = require('../models/bingocard');


const transporter = nodemailer.createTransport({
    service: 'Zoho',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

module.exports.bingoCardForm = (req, res) => {
    res.render('bingoCardForm');
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

//SEND IMAGE TO EMAIL
module.exports.createBingoCard = async (req, res) => {
    const { playerName, playerPhoneNum, cardQty, email } = req.body.info;
    const playerInfo = new BingoCard({ playerName, playerPhoneNum });
    playerInfo.cards = await createBingoCards(cardQty, playerInfo._id);
    await playerInfo.save();
    const images = await generateBase64Images(playerInfo);
    let attachments = [];
    for (let image of images) {
        attachments.push({ path: image });
    }
    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: 'Bingo', // Subject line
        html: `<div>Let's play bingo!</div>`, // plain text body
        attachments
    };
    await transporter.sendMail(mailOptions);

    playerInfo.images = images;
    await playerInfo.save();
    req.flash('success', 'Successful Genarating Bingo Cards!');
    res.redirect('/');
}