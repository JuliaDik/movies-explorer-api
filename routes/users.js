const router = require('express').Router();

const { getUserData, updateUserData } = require('../controllers/users');

// получить данные пользователя (email и name)
router.get('/me', getUserData);

// обновить данные пользователя (email и name)
router.patch('/me', updateUserData);

module.exports = router;
