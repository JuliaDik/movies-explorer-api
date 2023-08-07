const User = require('../models/user');

// получить информацию о пользователе (email и name)
const getUserInfo = (req, res) => {
  // сохраним id пользователя из объекта запроса
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id
  User.findById(userId)
    // ОТВЕТ ОТ БД: объект пользователя
    .then((user) => res.send(user));
};

// обновить информацию о пользователе (email и name)
const updateUserInfo = (req, res) => {
  // сохраним email и имя из тела запроса
  const { email, name } = req.body;
  // сохраним id пользователя из объекта запроса
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id и обновить его данные (email и name)
  User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    // ОТВЕТ ОТ БД: объект пользователя с обновленными email и name
    .then((user) => res.send(user));
};

module.exports = { getUserInfo, updateUserInfo };
