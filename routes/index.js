const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

// маршрут запроса на регистрацию
router.post('/signup', createUser);

// маршрут запроса на авторизацию
router.post('/signin', login);

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
