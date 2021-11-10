if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const PORT = process.env.PORT || 3000;
const nodeHtmlToImage = require('node-html-to-image');
const base64ToImage = require('base64-to-image');
const createBingoCards = require('./createBingoCards');

const BingoCard = require('./models/bingocard');


mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
    .then(() => console.log('Mongo connected!'))
    .catch((err) => console.log('Error! ', err));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    const bingocards = await BingoCard.find({});
    res.render('home', { bingocards });
});

app.post('/', async (req, res) => {
    const { playerName, playerPhoneNum, cardQty } = req.body.info;
    const playerInfo = new BingoCard({ playerName, playerPhoneNum });
    playerInfo.cards = await createBingoCards(cardQty, playerInfo._id);
    await playerInfo.save();

    async function rowGenerator(pInfo) {
        let arr = [];
        for (let card of pInfo.cards) {
            console.log('BINGO');
            for (let rowIdx = 5; rowIdx <= 9; rowIdx++) {
                for (let rowElement of card.cardInfo[rowIdx].line) {
                    arr.push(rowElement);
                }
            }
        }
        return arr;
    }

    async function randomColor() {
        let colors = ['blue', 'yellow', 'orange', '#aa3333'];
        let randomNum = Math.floor(Math.random() * colors.length);
        return colors[randomNum];
    }

    async function generateBase64Images(pInfo) {
        let base64Images = [];
        for (let card of pInfo.cards) {
            let color = await randomColor();
            let image = await nodeHtmlToImage({
                // output: `./cardsGenerated/${card._id}.png`,
                transparent: true,
                html: `
                    <html>
                    <head>
                        <title>Bingo</title>
                        <style>
                            table {
                                background-color: ${color};
                                border: 1px solid black; 
                                height: 600px; 
                                padding: 10px; 
                                border-radius: 10px;
                                margin: 0 auto;
                            }
        
                            .numbers {
                                background-color: white;
                                font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
                                font-size: 30px;
                                width: 80px;
                                margin: 50px;
                                border: 1px solid black; border-radius: 7px;
                            }
        
                            .bingo-headers {
                                font-size: 50px;
                                font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
                            }
                            .rowData{
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <table>
                            <thead>
                                <tr>
                                    <th class="bingo-headers">B</th>
                                    <th class="bingo-headers">I</th>
                                    <th class="bingo-headers">N</th>
                                    <th class="bingo-headers">G</th>
                                    <th class="bingo-headers">O</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="rowData">
                                    <td class="numbers">${card.cardInfo[5].line[0]}</td>
                                    <td class="numbers">${card.cardInfo[5].line[1]}</td>
                                    <td class="numbers">${card.cardInfo[5].line[2]}</td>
                                    <td class="numbers">${card.cardInfo[5].line[3]}</td>
                                    <td class="numbers">${card.cardInfo[5].line[4]}</td>
                                </tr>
                                <tr class="rowData">
                                    <td class="numbers">${card.cardInfo[6].line[0]}</td>
                                    <td class="numbers">${card.cardInfo[6].line[1]}</td>
                                    <td class="numbers">${card.cardInfo[6].line[2]}</td>
                                    <td class="numbers">${card.cardInfo[6].line[3]}</td>
                                    <td class="numbers">${card.cardInfo[6].line[4]}</td>
                                </tr>
                                <tr class="rowData">
                                    <td class="numbers">${card.cardInfo[7].line[0]}</td>
                                    <td class="numbers">${card.cardInfo[7].line[1]}</td>
                                    <td class="numbers">${card.cardInfo[7].line[2]}</td>
                                    <td class="numbers">${card.cardInfo[7].line[3]}</td>
                                    <td class="numbers">${card.cardInfo[7].line[4]}</td>
                                </tr>
                                <tr class="rowData">
                                    <td class="numbers">${card.cardInfo[8].line[0]}</td>
                                    <td class="numbers">${card.cardInfo[8].line[1]}</td>
                                    <td class="numbers">${card.cardInfo[8].line[2]}</td>
                                    <td class="numbers">${card.cardInfo[8].line[3]}</td>
                                    <td class="numbers">${card.cardInfo[8].line[4]}</td>
                                </tr>
                                <tr class="rowData">
                                    <td class="numbers">${card.cardInfo[9].line[0]}</td>
                                    <td class="numbers">${card.cardInfo[9].line[1]}</td>
                                    <td class="numbers">${card.cardInfo[9].line[2]}</td>
                                    <td class="numbers">${card.cardInfo[9].line[3]}</td>
                                    <td class="numbers">${card.cardInfo[9].line[4]}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="font-size: x-small; height: 0;">
                                        Owner: ${playerName.toUpperCase()}<br>
                                            Card Id: ${playerInfo._id}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>
                    </html>`
            });
            const base64Image = new Buffer.from(image).toString('base64');
            const dataURI = 'data:image/png;base64,' + base64Image
            base64Images.push(dataURI);
        }
        return base64Images;
    }

    const images = await generateBase64Images(playerInfo);
    let counter = 1;
    for (let image of images) {
        const path = './';
        const optionalObj = { fileName: `${playerName}${counter}`, type: 'png' };
        await base64ToImage(image, path, optionalObj);
        counter++;
    }
    playerInfo.images = images;
    await playerInfo.save();
    res.redirect('/');
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));