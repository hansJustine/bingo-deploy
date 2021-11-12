const express = require('express');
const router = express.Router();
const { createBingoCard, bingoCardForm, createGameSession } = require('../controllers/cards');
const catchAsync = require('../utils/catchAsync');
const { validateCard, validateGameSession } = require('../middleware');

router.get('/', catchAsync(bingoCardForm));

router.post('/', validateCard, catchAsync(createBingoCard));

router.post('/gamesession', validateGameSession, catchAsync(createGameSession));



module.exports = router;