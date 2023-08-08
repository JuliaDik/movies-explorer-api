const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// ПРОВЕРКА НАЛИЧИЯ ВАЛИДНОГО ТОКЕНА (ВЫДАННОГО ПОСЛЕ УСПЕШНОЙ АВТОРИЗАЦИИ)

const auth = (req, res, next) => {
  // сохраняем заголовок authorization из заголовков запроса
  const { authorization } = req.headers;
  // в заголовке authorization записана схема аутентификации Bearer,
  // в которой прописан токен, выданный пользователю при авторизации (login)
  // извлекаем из этой схемы токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // проверяем валидность токена
    // сраниваем идентификатор пользователя, секретный ключ подписи, срок действия токена
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    console.error(err);
  }
  // добавляем в объект запроса payload токена
  req.user = payload;
  return next();
};

module.exports = auth;
