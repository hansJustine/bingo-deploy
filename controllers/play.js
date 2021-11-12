const { createNumbers } = require('../utils/createBingoCards');

module.exports.playBingo = async (req, res) => {
    //set numbers possible for rolling cards
    if(!req.session.possibleNums) req.session.possibleNums = createNumbers();
    console.log(req.params.id);
    req.session.gameSession = req.params.id;
    const playProps = {
        rolledNums: req.session.rolledNums,
        latestRolledNum: req.session.rolledNums ? req.session.rolledNums[req.session.rolledNums.length - 1] : '',
        gameSession: req.session.gameSession 
    }
    res.render('play', playProps);
}

module.exports.playBingoPost = async (req, res) => {
    let { rolledNum } = req.body;

    let possibleNums = req.session.possibleNums;
    if(!req.session.maxRolls) req.session.maxRolls = 75;
    if(req.session.maxRolls){
        if(!possibleNums[rolledNum - 1]){
            req.flash('error', 'You have already entered that number!');
        } else {
            await req.session.rolledNums ? req.session.rolledNums.push(rolledNum) : req.session.rolledNums = [rolledNum];
            possibleNums[rolledNum - 1] = null;
            req.session.maxRolls--;
            console.log(possibleNums);
        }
    }
    console.log(req.session.maxRolls);
    res.redirect(`/play/${req.session.gameSession}`);
}