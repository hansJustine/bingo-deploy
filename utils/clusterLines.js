module.exports = async function (foundGameSes, cards) {
    console.log(cards);
    for(let card of cards){

        if(card.lineName.slice(0,1) === 'r' && card.lineName !== 'r3') foundGameSes.rowsWo3s.push(card);
        else if(card.lineName === 'd1' || card.lineName === 'd2') foundGameSes.diagonals.push(card);
        else if(card.lineName === 'B') foundGameSes.bLines.push(card);   
        else if(card.lineName === 'I') foundGameSes.iLines.push(card);   
        else if(card.lineName === 'N') foundGameSes.nLines.push(card);   
        else if(card.lineName === 'G') foundGameSes.gLines.push(card);   
        else if(card.lineName === 'O') foundGameSes.oLines.push(card);   
        else if(card.lineName === 'r3') foundGameSes.row3.push(card);
    }
}