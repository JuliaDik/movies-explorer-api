const router = require('express').Router();
// для валидации данных запроса (body, cookies, headers, params, query, signedCookies)
// контроллер не запускается, если валидация не пройдена успешно
const { celebrate, Joi } = require('celebrate');
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { URL_REGEX } = require('../utils/constants');

// получить фильмы (сохраненные)
router.get('/', getSavedMovies);

// создать фильм
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(URL_REGEX),
    trailer: Joi.string().required().regex(URL_REGEX),
    thumbnail: Joi.string().required().regex(URL_REGEX),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// удалить фильм
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
