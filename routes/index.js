const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');

// маршрут запросов к коллекции БД "пользователи"
router.use('/users', usersRouter);

// маршрут запросов к коллекции БД "фильмы"
router.use('/movies', moviesRouter);

module.exports = router;
