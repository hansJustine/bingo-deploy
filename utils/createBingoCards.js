const createNumbers = (minimum = 1, maximum = 75) => (
    Array.from({ length: maximum - minimum + 1 })
        .map((unused, index) => index + minimum))

const generateRandomNum = (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min);

const colMinMax = {
    B: { min: 1, max: 15 },
    I: { min: 16, max: 30 },
    N: { min: 31, max: 45 },
    G: { min: 46, max: 60 },
    O: { min: 61, max: 75 },
}

const generateColumn = (columnName, id, nums = createNumbers()) => {
    const name = columnName.toUpperCase();
    let column = [];
    while (column.length < 5) {
        if (name === 'N' && column.length === 2) {
            column.push('FREE');
            continue;
        }
        let randomNum = generateRandomNum(colMinMax[name].min, colMinMax[name].max);
        if (!nums[randomNum - 1]) continue;
        column.push(randomNum);
        nums[randomNum - 1] = null;
    }
    return { lineName: name, lineTracker: 5, line: column, winnerId: id };
}

const generateRows = (bingoCard, id) => {
    for (let i = 0; i < 5; i++) {
        let tempRow = [];
        tempRow.push(bingoCard[0].line[i]);
        tempRow.push(bingoCard[1].line[i]);
        tempRow.push(bingoCard[2].line[i]);
        tempRow.push(bingoCard[3].line[i]);
        tempRow.push(bingoCard[4].line[i]);
        // console.log(tempRow);
        let rowObj = { lineName: `r${i + 1}`, lineTracker: 5, line: tempRow, winnerId: id };
        bingoCard.push(rowObj);
    }
}

const generateDiagonals = (bingoCard, id) => {
    let firstDiagonal = [];
    for (let i = 0; i < 5; i++) {
        firstDiagonal.push(bingoCard[i].line[i]);
    }
    bingoCard.push({ lineName: 'd1', lineTracker: 5, line: firstDiagonal, winnerId: id });
    let secondDiagonal = [];
    let indexOfNum = 0;
    for (let j = 4; j >= 0; j--) {
        secondDiagonal.push(bingoCard[j].line[indexOfNum]);
        indexOfNum++;
    }
    bingoCard.push({ lineName: 'd2', lineTracker: 5, line: secondDiagonal, winnerId: id });

    return bingoCard;
}

module.exports.createBingoCards = async function createBingoCards(qty, id) {
    let totalCards = [];
    function helper(num) {
        let bingoCard = [];
        bingoCard.push(generateColumn('b', id));
        bingoCard.push(generateColumn('i', id));
        bingoCard.push(generateColumn('n', id));
        bingoCard.push(generateColumn('g', id));
        bingoCard.push(generateColumn('o', id));
        generateRows(bingoCard, id);
        generateDiagonals(bingoCard, id);
        totalCards.push({ cardInfo: bingoCard });
        if (num > 1) helper(--num);
    }
    helper(qty);
    return totalCards;
}

module.exports.createNumbers = createNumbers;