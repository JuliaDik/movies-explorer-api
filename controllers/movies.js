const Movie = require('../models/movie');

// ПОЛУЧИТЬ СОХРАНЕННЫЕ ФИЛЬМЫ

const getSavedMovies = (req, res) => {
  // сохраним id пользователя из объекта запроса
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти все сохраненные фильмы (ссылаемся на id пользователя-владельца)
  Movie.find({ owner: userId })
    // ОТВЕТ ОТ БД: массив JSON-ов сохраненных фильмов
    .then((movies) => res.send(movies));
};

// СОЗДАТЬ ФИЛЬМ

const createMovie = (req, res) => {
  // сохраним id пользователя из объекта запроса
  const owner = req.user._id;
  // сохраняем из тела запроса следующие данные фильма
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
  // ОБРАЩЕНИЕ К БД: сохранить новый фильм в БД (+указываем id пользователя, сохраняющего фильм)
  Movie.create({
    owner,
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
    // ОТВЕТ ОТ БД: JSON фильма (с присвоенным ему _id + указанием id пользователя в owner)
    .then((movie) => res.send(movie));
};

// УДАЛИТЬ ФИЛЬМ

const deleteMovie = (req, res) => {
  // сохраним id фильма из параметров запроса (содержится в url запроса)
  const { _id } = req.params;
  // ОБРАЩЕНИЕ К БД: найти фильм по id
  Movie.findById(_id)
    // найденный фильм удалить
    .then((movie) => movie.deleteOne())
    // ОТВЕТ ОТ БД
    .then(() => res.send({ message: 'Фильм удален' }));
};

module.exports = { getSavedMovies, createMovie, deleteMovie };
