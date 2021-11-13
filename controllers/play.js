const { createNumbers } = require('../utils/createBingoCards');
const GameSession = require('../models/gameSession');

module.exports.playBingo = async (req, res) => {
    //set numbers possible for rolling cards
    let foundSession = await GameSession.findById(req.params.id);
    let reqSession = req.session;
    let sessionName = foundSession.sessionName;
    if(!reqSession[sessionName]) reqSession[sessionName] =  req.params.id;
    await setSessOfLinesAndHistory(foundSession, reqSession, sessionName);
    console.log(reqSession[`${sessionName}Blines`] );
    if(!reqSession[`possibleNums${sessionName}`]) reqSession[`possibleNums${sessionName}`] = createNumbers()
    const playProps = {
        rolledNums: reqSession[`rolledNums${sessionName}`],
        latestRolledNum: reqSession[`rolledNums${sessionName}`] ? reqSession[`rolledNums${sessionName}`][reqSession[`rolledNums${sessionName}`].length - 1] : '',
        gameSession: reqSession[sessionName]
    }
    console.log("GET", reqSession[`possibleNums${sessionName}`], reqSession[sessionName])
    res.render('play', playProps);
}

module.exports.playBingoPost = async (req, res) => {
    let foundSession = await GameSession.findById(req.params.id);
    let { rolledNum } = req.body;
    let sessionName = foundSession.sessionName
    let reqSession = req.session;
    if(!reqSession[`maxRolls${sessionName}`]) reqSession[`maxRolls${sessionName}`] = 75;
    if(reqSession[`maxRolls${sessionName}`]){
        if(!reqSession[`possibleNums${sessionName}`][rolledNum - 1]){
            req.flash('error', 'You have already entered that number!');
        } else {
            await reqSession[`rolledNums${sessionName}`] ? reqSession[`rolledNums${sessionName}`].push(rolledNum) : reqSession[`rolledNums${sessionName}`] = [rolledNum];
            reqSession[`possibleNums${sessionName}`][rolledNum - 1] = null;
            reqSession[`maxRolls${sessionName}`]--;
        }
    }
    console.log(reqSession[`maxRolls${sessionName}`])
    res.redirect(`/play/${reqSession[sessionName]}`);
}

async function setSessOfLinesAndHistory(foundSession, reqSession, sessionName) {
    if(!reqSession[`${sessionName}History`]) reqSession[`${sessionName}History`] = [];
    reqSession[`${sessionName}Blines`] = foundSession.bLines.slice();
    reqSession[`${sessionName}Ilines`] = foundSession.iLines.slice();
    reqSession[`${sessionName}Nlines`] = foundSession.nLines.slice();
    reqSession[`${sessionName}Glines`] = foundSession.gLines.slice();
    reqSession[`${sessionName}Olines`] = foundSession.oLines.slice();
    reqSession[`${sessionName}RowsWo3s`] = foundSession.rowsWo3s.slice();
    reqSession[`${sessionName}Row3`] = foundSession.row3.slice();
    reqSession[`${sessionName}Diagonals`] = foundSession.diagonals.slice();
}