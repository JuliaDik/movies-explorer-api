const mongoose = require('mongoose');
const validator = require('validator');

// схема пользователя
const userSchema = new mongoose.Schema({
  // почта пользователя (для регистрации)
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => validator.isEmail(email),
  },
  // пароль пользователя (хеш)
  password: {
    type: String,
    required: true,
    // по умолчанию: из БД хеш пароля пользователя не возваращается
    select: false,
  },
  // имя пользователя
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// модель пользователя
const User = mongoose.model('user', userSchema);

module.exports = User;
