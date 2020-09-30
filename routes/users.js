const express = require('express');
const {
  validateUpdateProfile,
  validateAvatar,
  validateId,
} = require('../middlewares/celebrateValidation');
const {
  getAllUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:_id', validateId, getUser);
userRouter.patch('/me', validateUpdateProfile, updateProfile);
userRouter.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = userRouter;
