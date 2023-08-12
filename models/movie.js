const mongoose = require('mongoose');
const { URL_REGEX } = require('../utils/constants');

// схема-шаблон для записи данных фильма в БД
const movieSchema = new mongoose.Schema({
  // страна создания фильма
  country: {
    type: String,
    required: true,
  },
  // режиссер фильма
  director: {
    type: String,
    required: true,
  },
  // длительность фильма
  duration: {
    type: Number,
    required: true,
  },
  // год выпуска фильма
  year: {
    type: String,
    required: true,
  },
  // описание фильма
  description: {
    type: String,
    required: true,
  },
  // ссылка на постер к фильму
  image: {
    type: String,
    required: true,
    validate: (url) => URL_REGEX.test(url),
  },
  // ссылка на трейлер фильма
  trailerLink: {
    type: String,
    required: true,
    validate: (url) => URL_REGEX.test(url),
  },
  // ссылка на миниатюрное изображение постера к фильму
  thumbnail: {
    type: String,
    required: true,
    validate: (url) => URL_REGEX.test(url),
  },
  // id пользователя, который сохранил фильм
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // id фильма, который содержится в ответе сервиса MoviesExplorer
  movieId: {
    type: Number,
    required: true,
  },
  // название фильма на русском языке
  nameRU: {
    type: String,
    required: true,
  },
  // название фильма на английском языке
  nameEN: {
    type: String,
    required: true,
  },
});

// модель фильма (используется в обращениии к БД в контроллерах)
const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;
