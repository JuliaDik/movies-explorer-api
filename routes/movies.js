const router = require('express').Router();

const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');

// получить фильмы (сохраненные)
router.get('/', getSavedMovies);

// создать фильм
router.post('/', createMovie);

// удалить фильм
router.delete('/:_id', deleteMovie);

module.exports = router;
