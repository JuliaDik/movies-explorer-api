const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUserValidator, loginValidator } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { NotFoundErrorMessage } = require('../utils/constants');

// маршрут запроса на регистрацию
router.post('/signup', createUserValidator, createUser);

// маршрут запроса на авторизацию
router.post('/signin', loginValidator, login);

// маршрут запросов к коллекции БД "пользователи"
// без успешной авторизации (без валидного токена) получить доступ к маршруту /users нельзя
router.use('/users', auth, usersRouter);

// маршрут запросов к коллекции БД "фильмы"
// без успешной авторизации (без валидного токена) получить доступ к маршруту /movies нельзя
router.use('/movies', auth, moviesRouter);

// несуществующий маршрут
router.all('*', auth, (req, res, next) => {
  next(new NotFoundError(NotFoundErrorMessage.noRoute));
});

module.exports = router;
