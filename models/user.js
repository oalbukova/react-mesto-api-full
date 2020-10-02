const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const AuthorizationError = require('../errors/authorization-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator(link) {
          return validator.isURL(link);
        },
        message: 'Некорректный URL',
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
      select: false,
    },
  },
  { versionKey: false },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .orFail(new AuthorizationError('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }
      return user; // теперь user доступен
    }));
};

module.exports = mongoose.model('user', userSchema);
