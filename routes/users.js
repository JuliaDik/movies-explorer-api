const router = require('express').Router();
// для валидации данных запроса (body, cookies, headers, params, query, signedCookies)
// контроллер не запускается, если валидация не пройдена успешно
const { celebrate, Joi } = require('celebrate');
const { getUserData, updateUserData } = require('../controllers/users');

// получить данные пользователя (name и email)
router.get('/me', getUserData);

// обновить данные пользователя (name и email)
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserData);

module.exports = router;
