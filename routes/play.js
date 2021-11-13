const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { playBingo, playBingoPost } = require('../controllers/play');
const { validateRolledNum } = require('../middleware');


router.get('/:id', catchAsync(playBingo));

router.post('/:id', validateRolledNum, catchAsync(playBingoPost));


module.exports = router;