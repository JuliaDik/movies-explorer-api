const router = require('express').Router();
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validation');

// получить фильмы (сохраненные)
router.get('/', getSavedMovies);

// создать фильм (добавить в сохраненные)
router.post('/', createMovieValidator, createMovie);

// удалить фильм (из сохраненных)
router.delete('/:movieId', deleteMovieValidator, deleteMovie);

module.exports = router;
