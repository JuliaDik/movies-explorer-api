const router = require('express').Router();

const { getUserInfo, updateUserInfo } = require('../controllers/users');

// получить данные пользователя (email и name)
router.get('/me', getUserInfo);

// обновить данные пользователя (email и name)
router.patch('/me', updateUserInfo);

module.exports = router;
