const express = require('express');
const router = express.Router();
const { createBingoCard, bingoCardForm } = require('../controllers/cards');

router.get('/', bingoCardForm);

router.post('/', createBingoCard);


module.exports = router;