const router = require('express').Router();
const { getUserData, updateUserData } = require('../controllers/users');
const { updateUserDataValidator } = require('../middlewares/validation');

// получить данные пользователя (name и email)
router.get('/me', getUserData);

// обновить данные пользователя (name и email)
router.patch('/me', updateUserDataValidator, updateUserData);

module.exports = router;
