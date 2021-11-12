const createBingoCards = require('../utils/createBingoCards');
const generateBase64Images = require('../utils/generateBase64');
const base64ToImage = require('base64-to-image');
const nodemailer = require('nodemailer');
const BingoCard = require('../models/bingocard');
const Line = require('../models/line');

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
    let cardsGenerated = await createBingoCards(cardQty, playerInfo._id);
    playerInfo.cards = cardsGenerated;
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
    let cardLines = cardsGenerated.reduce((lines, card) => lines.concat(card.cardInfo), []);
    console.log(cardLines);
    await Line.insertMany(cardLines);
    req.flash('success', 'Successful Genarating Bingo Cards!');
    res.redirect('/');
}

module.exports.playBingo = async (req, res) => {
    // const lines = await Line.find({});
    // for(let line of lines){
    //     if(line.lineName === 'B') req.session.b ? req.session.b.push(line) : req.session.b = [line];
    //     else if(line.lineName === 'I') req.session.i ? req.session.i.push(line) : req.session.i = [line];
    //     else if(line.lineName === 'N') req.session.n ? req.session.n.push(line) : req.session.n = [line];
    //     else if(line.lineName === 'G') req.session.g ? req.session.g.push(line) : req.session.g = [line];
    //     else if(line.lineName === 'O') req.session.o ? req.session.o.push(line) : req.session.o = [line];
    //     else if(line.lineName !== 'r3') req.session.rowsWo3 ? req.session.rowsWo3.push(line) : req.session.rowsWo3 = [line];
    //     else req.session.nFree ? req.session.nFree.push(line) : req.session.nFree = [line];
    // }
    const playProps = {
        rolledNums: req.session.rolledNums,
        latestRolledNum: req.session.rolledNums ? req.session.rolledNums[req.session.rolledNums.length - 1] : ''
    }
    res.render('play', playProps);
}

module.exports.playBingoPost = async (req, res) => {
    let { rolledNum } = req.body;
    await req.session.rolledNums ? req.session.rolledNums.push(rolledNum) : req.session.rolledNums = [rolledNum];
    res.redirect('/play');
}