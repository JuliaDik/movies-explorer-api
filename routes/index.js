const router = require('express').Router();
// для валидации данных запроса (body, cookies, headers, params, query, signedCookies)
// контроллер не запускается, если валидация не пройдена успешно
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

// маршрут запроса на регистрацию
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// маршрут запроса на авторизацию
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// маршрут запросов к коллекции БД "пользователи"
// без успешной авторизации (без валидного токена) получить доступ к маршруту /users нельзя
router.use('/users', auth, usersRouter);

// маршрут запросов к коллекции БД "фильмы"
// без успешной авторизации (без валидного токена) получить доступ к маршруту /movies нельзя
router.use('/movies', auth, moviesRouter);

// несуществующий маршрут
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый роут не найден'));
});

module.exports = router;
