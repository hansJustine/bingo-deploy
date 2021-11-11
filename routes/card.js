const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBingoCard, bingoCardForm } = require('../controllers/cards');

router.get('/', bingoCardForm);

router.post('/', createBingoCard);

module.exports = router;