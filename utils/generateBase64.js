const nodeHtmlToImage = require('node-html-to-image');
const QRCode = require('qrcode')

var opts = {
    errorCorrectionLevel: 'L',
    type: 'image/png',
    quality: 0.3,
    scale: 0,
    margin: 0,
    width: 0,
    qzone: 1
}

const generateQR = async text => {
    try {
        return await QRCode.toDataURL(text._id.toString(), opts);
    } catch (err) {
        console.error(err)
    }
}

async function randomColor() {
    let colors = ['yellow', 'orange', '#aa3333'];
    let randomNum = Math.floor(Math.random() * colors.length);
    return colors[randomNum];
}

module.exports = async function generateBase64Images(pInfo) {
    let base64Images = [];
    for (let card of pInfo.cards) {
        let color = await randomColor();
        let qr = await generateQR(card);
        let image = await nodeHtmlToImage({
            // output: `./cardsGenerated/${card._id}.png`,
            transparent: true,
            html: `
                <html>
                <head>
                    <title>Bingo</title>
                    <style>
                        body{
                         width: 500px;   
                        }
                        table {
                            background-color: ${color};
                            border: 1px solid black; 
                            height: 650px; 
                            padding: 10px; 
                            border-radius: 10px;
                            margin: 0 auto;
                        }
    
                        .numbers {
                            background-color: white;
                            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
                            font-size: 30px;
                            width: 100px;
                            height: 100px;
                            margin: 50px;
                            border: 1px solid black; border-radius: 7px;
                        }
    
                        .bingo-headers {
                            font-size: 70px;
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
                                    Owner: ${pInfo.playerName.toUpperCase()}<br>
                                    Card Id: ${card._id}
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