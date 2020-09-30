const express = require('express');
const {
  validateCard,
  validateId,
} = require('../middlewares/celebrateValidation');
const {
  getAllCards,
  createCard,
  findByIdAndRemoveCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/', getAllCards);
cardRouter.post('/', validateCard, createCard);
cardRouter.delete('/:_id', validateId, findByIdAndRemoveCard);
cardRouter.put('/:_id/likes', validateId, likeCard);
cardRouter.delete('/:_id/likes', validateId, dislikeCard);

module.exports = cardRouter;
