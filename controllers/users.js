const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const { ConflictErrorMessage, BadRequestErrorMessage, NotFoundErrorMessage } = require('../utils/constants');
const { SECRET_KEY } = require('../utils/config');

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
      // _id автоматически присваивается новой записи в БД
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(ConflictErrorMessage.userEmail));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(BadRequestErrorMessage.userData));
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
        // тот _id, который был присвоен при создании нового пользователя,
        // записываем в свойство _id (токен получает уникальное значение)
        // по _id пользователя будет осуществляться верификация токена (jwt.verify)
        // на этапе предоставления доступа к защищенным маршрутам
        { _id: user._id },
        // секретный ключ подписи
        SECRET_KEY,
        // период действия токена: 7 дней
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
  // получаем id пользователя из пользовательского ключа
  // --> из payload токена, присвоенного перед предоставлением доступа к защищенным маршрутам
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
        return next(new BadRequestError(BadRequestErrorMessage.userId));
      }
      return next(err);
    });
};

// ОБНОВИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (name и email)

const updateUserData = (req, res, next) => {
  // получаем из тела запроса name и email
  const { name, email } = req.body;
  // получаем id пользователя из пользовательского ключа
  // --> из payload токена, присвоенного перед предоставлением доступа к защищенным маршрутам
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id и обновить его данные (name и email)
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NotFoundErrorMessage.userId);
      }
      // ОТВЕТ ОТ БД: JSON пользователя с обновленными данными (name и email)
      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(ConflictErrorMessage.userEmail));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(BadRequestErrorMessage.userUpdate));
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
