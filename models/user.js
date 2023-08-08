const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// схема-шаблон для записи данных пользователя в БД
const userSchema = new mongoose.Schema({
  // почта пользователя
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => validator.isEmail(email),
  },
  // пароль пользователя (записывается в формате хеша)
  password: {
    type: String,
    required: true,
    // по умолчанию: из БД хеш пароля пользователя не возвращается
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

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  // находим в БД пользователя по почте, т.к. почта - уникальное поле
  // this = User
  return this.findOne({ email }).select('+password')
    .then((user) => {
      // не нашелся пользователь — ошибка
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // нашелся пользовател — сравниваем хеши двух паролей:
      // переданного при авторизации и найденного в БД
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          // не совпали хеши паролей - ошибка
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          // совпали хеши паролей - вернуть JSON пользователя из БД
          return user;
        });
    });
};

// модель пользователя
const User = mongoose.model('user', userSchema);

module.exports = User;
