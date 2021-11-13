const { createNumbers } = require('../utils/createBingoCards');
const GameSession = require('../models/gameSession');

module.exports.playBingo = async (req, res) => {
    //set numbers possible for rolling cards
    let foundSession = await GameSession.findById(req.params.id);
    let reqSession = req.session;
    let sessionName = foundSession.sessionName;
    if (!reqSession[sessionName]) reqSession[sessionName] = req.params.id;
    await setSessOfLinesAndHistory(foundSession, reqSession, sessionName);
    // console.log(reqSession[`${sessionName}Blines`]);
    if (!reqSession[`possibleNums${sessionName}`]) reqSession[`possibleNums${sessionName}`] = createNumbers()
    const playProps = {
        rolledNums: reqSession[`rolledNums${sessionName}`],
        latestRolledNum: reqSession[`rolledNums${sessionName}`] ? reqSession[`rolledNums${sessionName}`][reqSession[`rolledNums${sessionName}`].length - 1] : '',
        gameSession: reqSession[sessionName]
    }
    // console.log("GET", reqSession[`possibleNums${sessionName}`], reqSession[sessionName])
    res.render('play', playProps);
}

module.exports.playBingoPost = async (req, res) => {
    let foundSession = await GameSession.findById(req.params.id);
    let { rolledNum } = req.body;
    rolledNum = Number(rolledNum);
    let sessionName = foundSession.sessionName
    let reqSession = req.session;
    if (!reqSession[`maxRolls${sessionName}`]) reqSession[`maxRolls${sessionName}`] = 75;
    if (reqSession[`maxRolls${sessionName}`]) {
        if (!reqSession[`possibleNums${sessionName}`][rolledNum - 1]) {
            req.flash('error', 'You have already entered that number!');
        } else {
            await reqSession[`rolledNums${sessionName}`] ? reqSession[`rolledNums${sessionName}`].push(rolledNum) : reqSession[`rolledNums${sessionName}`] = [rolledNum];
            reqSession[`possibleNums${sessionName}`][rolledNum - 1] = null;
            reqSession[`maxRolls${sessionName}`]--;
            let history = {}

            console.log(reqSession[`${sessionName}Row3`])

            for (let roll = 0; roll < reqSession[`${sessionName}RowsWo3s`].length; roll++) {
                if (rolledNum >= 1 && rolledNum <= 15) {
                    checkWinningColumnLines(roll, 'B', reqSession, sessionName, rolledNum);
                    checkWinningRowWo3sLines(roll, 'B', reqSession, sessionName, rolledNum);
                    checkWinningRow3Lines(roll, 'B', reqSession, sessionName, rolledNum)
                    checkWinningDiagonalLines(roll, 'B', reqSession, sessionName, rolledNum);
                } else if (rolledNum >= 16 && rolledNum <= 30) {
                    checkWinningColumnLines(roll, 'I', reqSession, sessionName, rolledNum);
                    checkWinningRowWo3sLines(roll, 'I', reqSession, sessionName, rolledNum);
                    checkWinningRow3Lines(roll, 'I', reqSession, sessionName, rolledNum)
                    checkWinningDiagonalLines(roll, 'I', reqSession, sessionName, rolledNum);
                } else if (rolledNum >= 31 && rolledNum <= 45) {
                    checkWinningColumnLines(roll, 'N', reqSession, sessionName, rolledNum);
                    checkWinningRowWo3sLines(roll, 'N', reqSession, sessionName, rolledNum);
                } else if (rolledNum >= 46 && rolledNum <= 60) {
                    checkWinningColumnLines(roll, 'G', reqSession, sessionName, rolledNum);
                    checkWinningRowWo3sLines(roll, 'G', reqSession, sessionName, rolledNum);
                    checkWinningRow3Lines(roll, 'G', reqSession, sessionName, rolledNum);
                    checkWinningDiagonalLines(roll, 'G', reqSession, sessionName, rolledNum);
                } else if (rolledNum >= 61 && rolledNum <= 75) {
                    checkWinningColumnLines(roll, 'O', reqSession, sessionName, rolledNum);
                    checkWinningRowWo3sLines(roll, 'O', reqSession, sessionName, rolledNum);
                    checkWinningRow3Lines(roll, 'O', reqSession, sessionName, rolledNum)
                    checkWinningDiagonalLines(roll, 'O', reqSession, sessionName, rolledNum);
                }
            }
            console.log("B: ", reqSession[`${sessionName}Blines`])
            // console.log("I: ", reqSession[`${sessionName}Ilines`])
            // console.log("N: ", reqSession[`${sessionName}Nlines`])
            // console.log("G: ", reqSession[`${sessionName}Glines`])
            // console.log("O: ", reqSession[`${sessionName}Olines`])
            // console.log("dia: ", reqSession[`${sessionName}Diagonals`])
            console.log("row3: ", reqSession[`${sessionName}Row3`])
            if (reqSession[`${sessionName}Winners`].length) console.log('winners: ', reqSession[`${sessionName}Winners`]);
        }
    }
    console.log(reqSession[`maxRolls${sessionName}`]);
    return res.redirect(`/play/${req.params.id}`);
}

async function setSessOfLinesAndHistory(foundSession, reqSession, sessionName) {
    if (!reqSession[`${sessionName}History`]) reqSession[`${sessionName}History`] = [];
    if (!reqSession[`${sessionName}Winners`]) reqSession[`${sessionName}Winners`] = [];
    if (!reqSession[`${sessionName}PlacesLeft`]) reqSession[`${sessionName}PlacesLeft`] = 2;
    if (!reqSession[`${sessionName}Blines`]) reqSession[`${sessionName}Blines`] = foundSession.bLines.slice();
    if (!reqSession[`${sessionName}Ilines`]) reqSession[`${sessionName}Ilines`] = foundSession.iLines.slice();
    if (!reqSession[`${sessionName}Nlines`]) reqSession[`${sessionName}Nlines`] = foundSession.nLines.slice();
    if (!reqSession[`${sessionName}Glines`]) reqSession[`${sessionName}Glines`] = foundSession.gLines.slice();
    if (!reqSession[`${sessionName}Olines`]) reqSession[`${sessionName}Olines`] = foundSession.oLines.slice();
    if (!reqSession[`${sessionName}RowsWo3s`]) reqSession[`${sessionName}RowsWo3s`] = foundSession.rowsWo3s.slice();
    if (!reqSession[`${sessionName}Row3`]) reqSession[`${sessionName}Row3`] = foundSession.row3.slice();
    if (!reqSession[`${sessionName}Diagonals`]) reqSession[`${sessionName}Diagonals`] = foundSession.diagonals.slice();
}

function checkWinningColumnLines(roll, columnName, reqSession, sessionName, rolledNum) {
    if (roll < reqSession[`${sessionName}${columnName}lines`].length && reqSession[`${sessionName}${columnName}lines`][roll].line.includes(rolledNum)) {
        reqSession[`${sessionName}${columnName}lines`][roll].lineTracker--;
        if (reqSession[`maxRolls${sessionName}`] <= 70 && reqSession[`${sessionName}${columnName}lines`][roll].lineTracker === 0) {
            reqSession[`${sessionName}Winners`].push({ winningNum: rolledNum, winningLine: reqSession[`${sessionName}${columnName}lines`][roll], numOfRolls: 75 - reqSession[`maxRolls${sessionName}`] });
        }
    }
}

function checkWinningRowWo3sLines(roll, columnName, reqSession, sessionName, rolledNum) {
    let rowIdx = { B: 0, I: 1, N: 2, G: 3, O: 4 };
    if (reqSession[`${sessionName}RowsWo3s`][roll].line[rowIdx[columnName]] === rolledNum) {
        reqSession[`${sessionName}RowsWo3s`][roll].lineTracker--;
        if (reqSession[`maxRolls${sessionName}`] <= 70 && reqSession[`${sessionName}RowsWo3s`][roll].lineTracker === 0) {
            reqSession[`${sessionName}Winners`].push({ winningNum: rolledNum, winningLine: reqSession[`${sessionName}RowsWo3s`][roll], numOfRolls: 75 - reqSession[`maxRolls${sessionName}`] });
        }
    }
}
function checkWinningRow3Lines(roll, columnName, reqSession, sessionName, rolledNum) {
    let idx = { B: 0, I: 1, G: 3, O: 4 };
    if (reqSession[`${sessionName}Row3`][roll].line[idx[columnName]] === rolledNum) {
        reqSession[`${sessionName}Row3`][roll].lineTracker--;
        if (reqSession[`maxRolls${sessionName}`] <= 70 && reqSession[`${sessionName}Row3`][roll].lineTracker === 0) {
            reqSession[`${sessionName}Winners`].push({ winningNum: rolledNum, winningLine: reqSession[`${sessionName}Row3`][roll], numOfRolls: 75 - reqSession[`maxRolls${sessionName}`] });
        }
    }
}
function checkWinningDiagonalLines(roll, columnName, reqSession, sessionName, rolledNum) {
    if (roll < reqSession[`${sessionName}Diagonals`].length) {
        if (reqSession[`${sessionName}Diagonals`][roll].lineName === 'd1') {
            let d1 = { B: 0, I: 1, G: 3, O: 4 };
            if (reqSession[`${sessionName}Diagonals`][roll].line[d1[columnName]] === rolledNum) {
                reqSession[`${sessionName}Diagonals`][roll].lineTracker--;
                if (reqSession[`maxRolls${sessionName}`] <= 70 && reqSession[`${sessionName}Diagonals`][roll].lineTracker === 0) {
                    reqSession[`${sessionName}Winners`].push({ winningNum: rolledNum, winningLine: reqSession[`${sessionName}Diagonals`][roll], numOfRolls: 75 - reqSession[`maxRolls${sessionName}`] });
                }
            }
        } else {
            let d2 = { B: 4, I: 3, G: 1, O: 0 };
            if (reqSession[`${sessionName}Diagonals`][roll].line[d2[columnName]] === rolledNum) {
                reqSession[`${sessionName}Diagonals`][roll].lineTracker--;
                if (reqSession[`maxRolls${sessionName}`] <= 70 && reqSession[`${sessionName}Diagonals`][roll].lineTracker === 0) {
                    reqSession[`${sessionName}Winners`].push({ winningNum: rolledNum, winningLine: reqSession[`${sessionName}Diagonals`][roll], numOfRolls: 75 - reqSession[`maxRolls${sessionName}`] });
                }
            }
        }

    }
}
