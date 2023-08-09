const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { UnauthorizedErrorMessage } = require('../utils/constants');
const { SECRET_KEY } = require('../utils/config');

// ПРОВЕРКА НАЛИЧИЯ ВАЛИДНОГО ТОКЕНА, ВЫДАННОГО В ПРОЦЕССЕ АВТОРИЗАЦИИ

const auth = (req, res, next) => {
  // сохраняем заголовок authorization из заголовков запроса
  // в заголовке authorization записана схема аутентификации Bearer,
  // в которой прописан токен, выданный пользователю при авторизации (login)
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(UnauthorizedErrorMessage.userLogin));
  }

  // извлекаем из схемы аутентификации токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // проверяем валидность токена
    // сраниваем идентификатор пользователя, секретный ключ подписи, срок действия токена
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError(UnauthorizedErrorMessage.userLogin));
  }
  // присваиваем пользовательскому ключу payload токена
  // payload токена имеет подобный формат:
  // { _id: '64d2a91ad88ee6013fb22848', iat: 1691528237, exp: 1692133037 }
  // впредь можно обращаться к _id пользователя (req.user._id)
  req.user = payload;
  return next();
};

module.exports = auth;
