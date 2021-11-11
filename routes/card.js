const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBingoCard, bingoCardForm } = require('../controllers/cards');
const catchAsync = require('../utils/catchAsync');
const { validateCard } = require('../middleware');

router.get('/', bingoCardForm);

router.post('/', validateCard, catchAsync(createBingoCard));

module.exports = router;