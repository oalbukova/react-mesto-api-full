const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({
      data: cards,
    }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    // вернём записанные в базу данные
    .then((card) => res.send({
      data: card,
    }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Указаны некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

const findByIdAndRemoveCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError('Нет карточки с таким id');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }
      Card.findByIdAndDelete(req.params._id)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $addToSet: {
        likes: req.user._id,
      },
    }, // добавить _id в массив, если его там нет
    {
      new: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((likes) => res.send({
      data: likes,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Указаны некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $pull: {
        likes: req.user._id,
      },
    }, // убрать _id из массива
    {
      new: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((likes) => res.send({
      data: likes,
    }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError(
          'Указаны некорректные данные при создании карточки',
        );
      }
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  findByIdAndRemoveCard,
  likeCard,
  dislikeCard,
};
