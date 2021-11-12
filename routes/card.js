const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBingoCard, bingoCardForm, playBingo, playBingoPost } = require('../controllers/cards');
const catchAsync = require('../utils/catchAsync');
const { validateCard } = require('../middleware');

router.get('/', bingoCardForm);

router.post('/', validateCard, catchAsync(createBingoCard));

router.get('/play', catchAsync(playBingo));

router.post('/play', catchAsync(playBingoPost));

module.exports = router;