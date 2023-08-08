const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// ПОЛУЧИТЬ СОХРАНЕННЫЕ ФИЛЬМЫ

const getSavedMovies = (req, res, next) => {
  // получаем из пользовательского ключа id пользователя
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти все сохраненные фильмы по id пользователя
  Movie.find({ owner: userId })
    // ОТВЕТ ОТ БД: массив JSON-ов сохраненных фильмов
    .then((movies) => res.send(movies))
    .catch(next);
};

// СОЗДАТЬ ФИЛЬМ

const createMovie = (req, res, next) => {
  // получаем из пользовательского ключа id пользователя
  const userId = req.user._id;
  // получаем из тела запроса следующие данные фильма
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  // ОБРАЩЕНИЕ К БД: сохранить новый фильм в БД (в owner записываем id пользователя)
  Movie.create({
    owner: userId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  })
    // ОТВЕТ ОТ БД: JSON фильма (все переданные данные + _id фильма)
    // статус 201 - «создано»
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

// УДАЛИТЬ ФИЛЬМ

const deleteMovie = (req, res, next) => {
  // получаем из параметров запроса id фильма (содержится в url запроса)
  const { _id } = req.params;
  // ОБРАЩЕНИЕ К БД: найти фильм по id
  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить фильм другого пользователя');
      }
      // найденный фильм удалить
      return movie.deleteOne();
    })
    // ОТВЕТ ОТ БД
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан некорректный _id фильма'));
      }
      return next(err);
    });
};

module.exports = { getSavedMovies, createMovie, deleteMovie };
