const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { BadRequestErrorMessage, NotFoundErrorMessage, ForbiddenErrorMessage } = require('../utils/constants');

// ПОЛУЧИТЬ СОХРАНЕННЫЕ ФИЛЬМЫ

const getSavedMovies = (req, res, next) => {
  // получаем id пользователя из пользовательского ключа
  // --> из payload токена, присвоенного перед предоставлением доступа к защищенным маршрутам
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти все сохраненные фильмы по id пользователя
  Movie.find({ owner: userId })
    // ОТВЕТ ОТ БД: массив JSON-ов сохраненных фильмов
    .then((movies) => res.send(movies))
    .catch(next);
};

// ДОБАВИТЬ ФИЛЬМ В СОХРАНЕННЫЕ

const createMovie = (req, res, next) => {
  // получаем id пользователя из пользовательского ключа
  // --> из payload токена, присвоенного перед предоставлением доступа к защищенным маршрутам
  const userId = req.user._id;
  // получаем из тела запроса следующие данные фильма
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
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
    trailerLink,
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
        return next(new BadRequestError(BadRequestErrorMessage.movieData));
      }
      return next(err);
    });
};

// УДАЛИТЬ ФИЛЬМ ИЗ СОХРАНЕННЫХ

const deleteMovie = (req, res, next) => {
  // получаем id пользователя из пользовательского ключа
  // --> из payload токена, присвоенного перед предоставлением доступа к защищенным маршрутам
  const userId = req.user._id;
  // получаем из параметров запроса id фильма (содержится в url запроса)
  const { movieId } = req.params;
  // ОБРАЩЕНИЕ К БД: найти фильм по id
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NotFoundErrorMessage.movieId);
      }
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError(ForbiddenErrorMessage.movieOwner);
      }
      // найденный фильм удалить
      return movie.deleteOne();
    })
    // ОТВЕТ ОТ БД
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(BadRequestErrorMessage.movieId));
      }
      return next(err);
    });
};

module.exports = { getSavedMovies, createMovie, deleteMovie };
