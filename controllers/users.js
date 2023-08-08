const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// РЕГИСТРАЦИЯ: создать пользователя

const createUser = (req, res, next) => {
  // получаем из тела запроса переданные пользователем данные (name, email, password)
  const { name, email, password } = req.body;
  // хешируем пароль пользователя
  bcrypt.hash(password, 10)
    // ОБРАЩЕНИЕ К БД: создать нового пользователя с переданными данными
    // _id пользователя добавляется автоматически
    // в поле password записывается хеш пароля
    .then((hash) => User.create({ name, email, password: hash }))
    // ОТВЕТ ОТ БД: JSON нового пользователя (вернуть name, email, _id)
    // хешированный пароль не возвращаем!
    // статус 201 - «создано»
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

// АВТОРИЗАЦИЯ: предоставить пользователю токен, позволяющий получить доступ к защищенным маршрутам

const login = (req, res, next) => {
  // получаем из тела запроса переданные пользователем данные (email, password)
  const { email, password } = req.body;
  // ОБРАЩЕНИЕ К БД: найти пользователя по учетным данным (email, password)
  User.findUserByCredentials(email, password)
    // возвращается JSON пользователя из БД
    .then((user) => {
      // генерируем токен для пользователя
      const token = jwt.sign(
        // идентификатор пользователя,
        // по которому осуществляется верификация токена (jwt.verify в auth)
        { _id: user._id },
        // секретный ключ подписи
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        // токен действителен в течение 7 дней
        // затем пользователю нужно будет вновь авторизоваться, т.е. получить новый токен
        { expiresIn: '7d' },
      );
      // ОТВЕТ ОТ БД: JSON токена пользователя
      res.send({ token });
    })
    .catch(next);
};

// ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (name и email)

const getUserData = (req, res, next) => {
  // получаем из пользовательского ключа id пользователя
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id
  User.findById(userId)
    // ОТВЕТ ОТ БД: JSON пользователя с данными (name и email)
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
};

// ОБНОВИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (name и email)

const updateUserData = (req, res, next) => {
  // получаем из тела запроса name и email
  const { name, email } = req.body;
  // получаем из пользовательского ключа id пользователя
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id и обновить его данные (name и email)
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      // ОТВЕТ ОТ БД: JSON пользователя с обновленными данными (name и email)
      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

module.exports = {
  getUserData,
  updateUserData,
  createUser,
  login,
};
