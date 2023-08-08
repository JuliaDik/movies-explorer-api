const router = require('express').Router();

const { getUserData, updateUserData } = require('../controllers/users');

// получить данные пользователя (name и email)
router.get('/me', getUserData);

// обновить данные пользователя (name и email)
router.patch('/me', updateUserData);

module.exports = router;
