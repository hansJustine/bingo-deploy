const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { playBingo, playBingoPost } = require('../controllers/play');


router.post('/', catchAsync(playBingoPost));

router.get('/:id', catchAsync(playBingo));


module.exports = router;