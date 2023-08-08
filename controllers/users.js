const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

// РЕГИСТРАЦИЯ: создать пользователя

const createUser = (req, res) => {
  // сохраняем из тела запроса переданные пользователем данные (email, password, name)
  const { email, password, name } = req.body;
  // хешируем пароль пользователя
  bcrypt.hash(password, 10)
    // ОБРАЩЕНИЕ К БД: создать новую запись пользователя с переданными данными
    // _id пользователя добавляется базой данных автоматически
    // в поле password записать хеш пароля
    .then((hash) => User.create({ email, password: hash, name }))
    // ОТВЕТ ОТ БД: JSON нового пользователя (вернуть только email, name, _id)
    // хешированный пароль не возвращаем!
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }));
};

// АВТОРИЗАЦИЯ: предоставить пользователю токен, позволяющий получить доступ к защищенным маршрутам

const login = (req, res) => {
  // сохраняем из тела запроса переданные пользователем данные (email, password)
  const { email, password } = req.body;
  // ОБРАЩЕНИЕ К БД: найти пользователя по учетным данным (email, password)
  User.findUserByCredentials(email, password)
    // возвращается JSON пользователя из БД
    .then((user) => {
      // генерируем токен для пользователя
      const token = jwt.sign(
        // идентификатор пользователя, по которому осуществляется верификация токена в auth
        { _id: user._id },
        // секретный ключ подписи
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        // токен действителен в течение 7 дней
        // затем пользователю нужно будет вновь авторизоваться, т.е. получить новый токен
        { expiresIn: '7d' },
      );
      // ОТВЕТ ОТ БД: JSON токена пользователя
      res.send({ token });
    });
};

// ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (email и name)

const getUserData = (req, res) => {
  // сохраним id пользователя из объекта запроса
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id
  User.findById(userId)
    // ОТВЕТ ОТ БД: JSON пользователя с данными (email и name)
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }));
};

// ОБНОВИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (email и name)

const updateUserData = (req, res) => {
  // сохраним email и name из тела запроса
  const { email, name } = req.body;
  // сохраним id пользователя из объекта запроса
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id и обновить его данные (email и name)
  User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    // ОТВЕТ ОТ БД: JSON пользователя с обновленными данными (email и name)
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }));
};

module.exports = {
  getUserData,
  updateUserData,
  createUser,
  login,
};
